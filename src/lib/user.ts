import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Role, type User } from "../../generated/prisma/browser";
import { db } from "~/server/db";
import { env } from "~/env";
import { can, type Permission } from "~/lib/roles";

/**
 * Resolve the role(s) a given email should be seeded with at sign-in time,
 * based on the FOUNDER_EMAILS / ADMIN_EMAILS env lists. Returns null if the
 * email isn't seeded — callers default to `[MEMBER]`.
 */
export function seedRolesForEmail(email: string): Role[] | null {
  const normalized = email.trim().toLowerCase();
  if (env.FOUNDER_EMAILS.includes(normalized)) return [Role.FOUNDER];
  if (env.ADMIN_EMAILS.includes(normalized)) return [Role.ADMIN];
  return null;
}

/**
 * Minimal Clerk user shape we actually need. Both the server SDK's `User`
 * object and the webhook payload (after normalization) satisfy it.
 */
type ClerkUserShape = {
  id: string;
  emailAddresses: ReadonlyArray<{ id: string; emailAddress: string }>;
  primaryEmailAddressId: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
};

function primaryEmail(user: ClerkUserShape): string | null {
  const primary = user.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId,
  );
  return primary?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? null;
}

function displayNameFor(user: ClerkUserShape, email: string): string {
  const parts = [user.firstName, user.lastName].filter(Boolean);
  if (parts.length) return parts.join(" ");
  return email.split("@")[0] ?? "New player";
}

/**
 * Upsert a User row from a Clerk user object. Applies FOUNDER/ADMIN seed from
 * env on first create; on update, only promotes roles (never demotes), so
 * admin-controlled role assignments aren't stomped by re-syncs.
 *
 * Falls back to email when the id doesn't match — a Clerk account recreated
 * under a new id (e.g. deleted and re-signed-up) would otherwise collide with
 * the stale row's unique email. We reassign the id on the existing row so the
 * user keeps their data; Prisma's default `onUpdate: Cascade` propagates the
 * rename to FK tables.
 */
export async function upsertUserFromClerk(
  clerkUser: ClerkUserShape,
): Promise<User> {
  const email = primaryEmail(clerkUser);
  if (!email) {
    throw new Error(`Clerk user ${clerkUser.id} has no email address`);
  }
  const displayName = displayNameFor(clerkUser, email);
  const avatarUrl = clerkUser.imageUrl || null;
  const seedRoles = seedRolesForEmail(email);

  return db.$transaction(async (tx) => {
    const byId = await tx.user.findUnique({ where: { id: clerkUser.id } });
    const existing = byId ?? (await tx.user.findUnique({ where: { email } }));

    if (!existing) {
      return tx.user.create({
        data: {
          id: clerkUser.id,
          email,
          displayName,
          avatarUrl,
          roles: seedRoles ?? [Role.MEMBER],
        },
      });
    }

    const shouldReseed =
      seedRoles &&
      existing.roles.length === 1 &&
      existing.roles[0] === Role.MEMBER;

    return tx.user.update({
      where: { id: existing.id },
      data: {
        ...(existing.id !== clerkUser.id ? { id: clerkUser.id } : {}),
        email,
        displayName,
        avatarUrl,
        ...(shouldReseed ? { roles: seedRoles } : {}),
      },
    });
  });
}

/**
 * Server helper to fetch the current signed-in user, auto-syncing from Clerk
 * if the DB row doesn't exist yet. Returns null when signed out.
 */
export async function getCurrentUser(): Promise<User | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const existing = await db.user.findUnique({ where: { id: userId } });
  if (existing) {
    // Re-apply env seed for users still at the default `[MEMBER]` — e.g.
    // rows that predate the multi-role migration, or users whose email was
    // only added to FOUNDER_EMAILS / ADMIN_EMAILS after their first sign-in.
    if (existing.roles.length === 1 && existing.roles[0] === Role.MEMBER) {
      const seedRoles = seedRolesForEmail(existing.email);
      if (seedRoles) {
        return db.user.update({
          where: { id: userId },
          data: { roles: seedRoles },
        });
      }
    }
    return existing;
  }

  const clerkUser = await currentUser();
  if (!clerkUser) return null;
  return upsertUserFromClerk(clerkUser);
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized: sign in required");
  return user;
}

export async function requirePermission(permission: Permission): Promise<User> {
  const user = await requireUser();
  if (!can(user.roles, permission)) {
    throw new Error(`Forbidden: missing permission '${permission}'`);
  }
  return user;
}
