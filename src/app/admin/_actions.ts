"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Role } from "../../../generated/prisma/browser";
import { db } from "~/server/db";
import { requirePermission } from "~/lib/user";
import { ASSIGNABLE_ROLES, can } from "~/lib/roles";

const updateRolesSchema = z.object({
  userId: z.string().min(1),
  roles: z.array(z.enum(ASSIGNABLE_ROLES)).min(0),
});

export type UpdateRolesResult =
  | { ok: true; roles: Role[] }
  | { ok: false; error: string };

export async function updateUserRoles(input: {
  userId: string;
  roles: Role[];
}): Promise<UpdateRolesResult> {
  const parsed = updateRolesSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid input" };
  }

  const actor = await requirePermission("manage_roles");

  const target = await db.user.findUnique({
    where: { id: parsed.data.userId },
    select: { roles: true },
  });
  if (!target) return { ok: false, error: "User not found" };

  // FOUNDER is env-seeded: you can't remove it and you can't add it through
  // this endpoint either (the zod schema doesn't accept it).
  if (target.roles.includes(Role.FOUNDER)) {
    return {
      ok: false,
      error: "FOUNDER is env-seeded and cannot be changed here",
    };
  }

  // De-dupe + default to MEMBER if they picked nothing.
  const uniqueRoles = Array.from(new Set(parsed.data.roles));
  const nextRoles: Role[] = uniqueRoles.length ? uniqueRoles : [Role.MEMBER];

  // Don't let the actor strip their own ability to manage roles.
  if (parsed.data.userId === actor.id && !can(nextRoles, "manage_roles")) {
    return {
      ok: false,
      error: "Keep at least one role that lets you manage roles",
    };
  }

  await db.user.update({
    where: { id: parsed.data.userId },
    data: { roles: nextRoles },
  });

  revalidatePath("/admin");
  return { ok: true, roles: nextRoles };
}
