"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "~/server/db";
import { requirePermission, requireUser } from "~/lib/user";
import { can } from "~/lib/roles";
import { ablyRest, channelNameForRoom } from "~/server/ably";
import { containsProfanity } from "~/server/profanity";
import { getOrCreateDm, isUserMuted } from "~/server/chat";

const sendMessageSchema = z.object({
  roomId: z.string().min(1),
  content: z.string().min(1).max(4000),
});

export type SendMessageResult =
  | { ok: true; messageId: string }
  | { ok: false; error: string };

export async function sendMessage(input: {
  roomId: string;
  content: string;
}): Promise<SendMessageResult> {
  const parsed = sendMessageSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: "Message is empty or too long" };

  const user = await requireUser();

  // Membership check (also enforces officer-only rooms & DM participants).
  const member = await db.chatRoomMember.findUnique({
    where: {
      roomId_userId: { roomId: parsed.data.roomId, userId: user.id },
    },
  });
  if (!member)
    return { ok: false, error: "You don't have access to this room" };

  if (await isUserMuted(user.id, parsed.data.roomId)) {
    return { ok: false, error: "You are muted in this room" };
  }

  if (containsProfanity(parsed.data.content)) {
    return {
      ok: false,
      error: "Message blocked — contains language that isn't allowed.",
    };
  }

  const room = await db.chatRoom.findUnique({
    where: { id: parsed.data.roomId },
    select: { slug: true },
  });
  if (!room) return { ok: false, error: "Room not found" };

  const message = await db.chatMessage.create({
    data: {
      roomId: parsed.data.roomId,
      authorId: user.id,
      content: parsed.data.content,
    },
    include: {
      author: {
        select: { id: true, displayName: true, avatarUrl: true },
      },
    },
  });

  // Fan out via Ably. Fire-and-wait so a failing publish surfaces as an error
  // to the composer rather than silently "succeeding" with no realtime update.
  await ablyRest()
    .channels.get(channelNameForRoom(room.slug))
    .publish("message", {
      id: message.id,
      roomId: message.roomId,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
      author: message.author,
    });

  return { ok: true, messageId: message.id };
}

export async function deleteMessage(messageId: string): Promise<void> {
  const actor = await requirePermission("moderate_chat");

  const message = await db.chatMessage.findUnique({
    where: { id: messageId },
    select: { id: true, roomId: true, room: { select: { slug: true } } },
  });
  if (!message) throw new Error("Message not found");

  await db.chatMessage.update({
    where: { id: messageId },
    data: {
      deletedAt: new Date(),
      deletedById: actor.id,
    },
  });

  await ablyRest()
    .channels.get(channelNameForRoom(message.room.slug))
    .publish("delete", { id: message.id });

  revalidatePath(`/chat/${message.room.slug}`);
}

const muteSchema = z.object({
  userId: z.string().min(1),
  roomId: z.string().optional(),
  minutes: z
    .number()
    .int()
    .positive()
    .max(60 * 24 * 30)
    .optional(),
  reason: z.string().max(500).optional(),
});

export async function muteUser(input: {
  userId: string;
  roomId?: string;
  minutes?: number;
  reason?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const actor = await requirePermission("moderate_chat");
  const parsed = muteSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid mute input" };

  // Don't let mods mute a FOUNDER/ADMIN.
  const target = await db.user.findUnique({
    where: { id: parsed.data.userId },
    select: { roles: true },
  });
  if (!target) return { ok: false, error: "User not found" };
  if (can(target.roles, "manage_roles")) {
    return { ok: false, error: "Can't mute an admin" };
  }

  const mutedUntil = parsed.data.minutes
    ? new Date(Date.now() + parsed.data.minutes * 60_000)
    : null;

  await db.chatMute.create({
    data: {
      userId: parsed.data.userId,
      roomId: parsed.data.roomId,
      mutedById: actor.id,
      mutedUntil,
      reason: parsed.data.reason,
    },
  });
  return { ok: true };
}

export async function unmuteUser(input: {
  userId: string;
  roomId?: string;
}): Promise<void> {
  await requirePermission("moderate_chat");
  await db.chatMute.deleteMany({
    where: {
      userId: input.userId,
      roomId: input.roomId ?? null,
    },
  });
}

export async function startDm(otherUserId: string): Promise<{
  ok: boolean;
  slug?: string;
  error?: string;
}> {
  const actor = await requireUser();
  try {
    const room = await getOrCreateDm(actor, otherUserId);
    return { ok: true, slug: room.slug };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Couldn't open DM";
    return { ok: false, error: message };
  }
}

export async function markRoomRead(roomId: string): Promise<void> {
  const user = await requireUser();
  await db.chatRoomMember.updateMany({
    where: { roomId, userId: user.id },
    data: { lastReadAt: new Date() },
  });
  // Nudge the chat layout so the sidebar's unread badges re-render.
  revalidatePath("/chat", "layout");
}
