import "server-only";
import { db } from "~/server/db";
import type { User } from "../../generated/prisma";
import { can } from "~/lib/roles";

export const DEFAULT_ROOMS = [
  {
    slug: "general",
    name: "#general",
    description: "All members — UNO talk, hype, random.",
    isOfficerOnly: false,
  },
  {
    slug: "officers",
    name: "#officers",
    description: "Officer planning and coordination.",
    isOfficerOnly: true,
  },
] as const;

/**
 * Seed the two default rooms if they don't exist yet, and ensure the given
 * user is a member of every room they're allowed to see.
 */
export async function ensureDefaultRoomsAndMembership(
  user: User,
): Promise<void> {
  for (const spec of DEFAULT_ROOMS) {
    await db.chatRoom.upsert({
      where: { slug: spec.slug },
      create: {
        slug: spec.slug,
        name: spec.name,
        description: spec.description,
        isOfficerOnly: spec.isOfficerOnly,
        kind: "ROOM",
      },
      update: {},
    });
  }

  const rooms = await db.chatRoom.findMany({
    where: { kind: "ROOM" },
    select: { id: true, isOfficerOnly: true },
  });

  const accessible = rooms.filter(
    (r) =>
      !r.isOfficerOnly ||
      can(user.roles, "moderate_chat") ||
      isOfficerish(user),
  );

  for (const room of accessible) {
    await db.chatRoomMember.upsert({
      where: { roomId_userId: { roomId: room.id, userId: user.id } },
      create: { roomId: room.id, userId: user.id },
      update: {},
    });
  }
}

/** True for anyone with any officer-tier role (not MEMBER or ADVISOR). */
export function isOfficerish(user: User): boolean {
  return can(user.roles, "can_dm");
}

/** Deterministic DM slug for a pair of user ids. */
export function dmSlugFor(a: string, b: string): string {
  const [lo, hi] = [a, b].sort();
  return `dm:${lo}__${hi}`;
}

/** Create the DM room if it doesn't exist, return the room. */
export async function getOrCreateDm(actor: User, otherUserId: string) {
  if (actor.id === otherUserId) {
    throw new Error("Can't DM yourself");
  }
  const other = await db.user.findUnique({
    where: { id: otherUserId },
    select: { id: true, roles: true, displayName: true },
  });
  if (!other) throw new Error("User not found");

  // Both sides must have can_dm.
  if (!can(actor.roles, "can_dm") || !can(other.roles, "can_dm")) {
    throw new Error("DMs are officer-only");
  }

  const slug = dmSlugFor(actor.id, other.id);
  const existing = await db.chatRoom.findUnique({ where: { slug } });
  if (existing) return existing;

  const room = await db.chatRoom.create({
    data: {
      slug,
      name: `DM: ${other.displayName}`,
      kind: "DM",
      isOfficerOnly: true,
      members: {
        create: [{ userId: actor.id }, { userId: other.id }],
      },
    },
  });
  return room;
}

/**
 * Rooms + DMs the user is a member of, with unread counts relative to the
 * member's lastReadAt (capped at 50 per room — UI just shows "50+").
 */
export async function listAccessibleRoomsFor(user: User) {
  await ensureDefaultRoomsAndMembership(user);

  const rooms = await db.chatRoom.findMany({
    where: {
      members: { some: { userId: user.id } },
    },
    orderBy: [{ kind: "asc" }, { createdAt: "asc" }],
    include: {
      members: {
        where: { userId: { not: user.id } },
        select: {
          user: { select: { id: true, displayName: true, avatarUrl: true } },
        },
      },
    },
  });

  const memberships = await db.chatRoomMember.findMany({
    where: { userId: user.id, roomId: { in: rooms.map((r) => r.id) } },
    select: { roomId: true, lastReadAt: true },
  });
  const lastReadByRoom = new Map(
    memberships.map((m) => [m.roomId, m.lastReadAt]),
  );

  const unreads = await Promise.all(
    rooms.map(async (r) => {
      const lastRead = lastReadByRoom.get(r.id);
      const count = await db.chatMessage.count({
        where: {
          roomId: r.id,
          deletedAt: null,
          authorId: { not: user.id },
          ...(lastRead ? { createdAt: { gt: lastRead } } : {}),
        },
      });
      return [r.id, count] as const;
    }),
  );
  const unreadByRoom = new Map(unreads);

  return rooms.map((r) => ({
    ...r,
    unreadCount: unreadByRoom.get(r.id) ?? 0,
  }));
}

export async function isUserMuted(
  userId: string,
  roomId: string,
): Promise<boolean> {
  const now = new Date();
  const mute = await db.chatMute.findFirst({
    where: {
      userId,
      AND: [
        { OR: [{ roomId }, { roomId: null }] },
        { OR: [{ mutedUntil: null }, { mutedUntil: { gt: now } }] },
      ],
    },
  });
  return !!mute;
}
