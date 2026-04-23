"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "~/server/db";
import { requirePermission } from "~/lib/user";

const dateish = z
  .string()
  .optional()
  .transform((v) => (v ? new Date(v) : null));

const moneySchema = z
  .string()
  .optional()
  .transform((v) => {
    if (!v?.trim()) return null;
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0) throw new Error("Invalid amount");
    return Math.round(n * 100);
  });

const upsertFundraiserSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(1).max(4000),
  goalCents: moneySchema,
  startsAt: dateish,
  endsAt: dateish,
});

function strField(form: FormData, key: string): string | undefined {
  const v = form.get(key);
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

export async function createFundraiser(formData: FormData): Promise<void> {
  const actor = await requirePermission("manage_fundraisers");

  const parsed = upsertFundraiserSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    goalCents: strField(formData, "goalDollars"),
    startsAt: strField(formData, "startsAt"),
    endsAt: strField(formData, "endsAt"),
  });
  if (!parsed.success) {
    throw new Error(
      parsed.error.issues.map((i) => i.message).join("; ") ??
        "Invalid fundraiser input",
    );
  }

  const fundraiser = await db.fundraiser.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      goalCents: parsed.data.goalCents,
      startsAt: parsed.data.startsAt,
      endsAt: parsed.data.endsAt,
      createdById: actor.id,
    },
  });

  revalidatePath("/fundraisers");
  redirect(`/fundraisers/${fundraiser.id}`);
}

export async function updateFundraiser(
  id: string,
  formData: FormData,
): Promise<void> {
  await requirePermission("manage_fundraisers");

  const parsed = upsertFundraiserSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    goalCents: strField(formData, "goalDollars"),
    startsAt: strField(formData, "startsAt"),
    endsAt: strField(formData, "endsAt"),
  });
  if (!parsed.success) {
    throw new Error(
      parsed.error.issues.map((i) => i.message).join("; ") ??
        "Invalid fundraiser input",
    );
  }

  await db.fundraiser.update({
    where: { id },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      goalCents: parsed.data.goalCents,
      startsAt: parsed.data.startsAt,
      endsAt: parsed.data.endsAt,
    },
  });

  revalidatePath("/fundraisers");
  revalidatePath(`/fundraisers/${id}`);
  redirect(`/fundraisers/${id}`);
}

const updateRaisedSchema = z.object({
  raisedDollars: z.number().min(0),
});

export async function updateRaised(input: {
  id: string;
  raisedDollars: number;
}): Promise<{ ok: boolean; error?: string }> {
  await requirePermission("manage_fundraisers");
  const parsed = updateRaisedSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid amount" };

  await db.fundraiser.update({
    where: { id: input.id },
    data: { raisedCents: Math.round(parsed.data.raisedDollars * 100) },
  });
  revalidatePath("/fundraisers");
  revalidatePath(`/fundraisers/${input.id}`);
  return { ok: true };
}

export async function closeFundraiser(id: string): Promise<void> {
  await requirePermission("manage_fundraisers");
  await db.fundraiser.update({ where: { id }, data: { isClosed: true } });
  revalidatePath("/fundraisers");
  revalidatePath(`/fundraisers/${id}`);
}

export async function reopenFundraiser(id: string): Promise<void> {
  await requirePermission("manage_fundraisers");
  await db.fundraiser.update({ where: { id }, data: { isClosed: false } });
  revalidatePath("/fundraisers");
  revalidatePath(`/fundraisers/${id}`);
}

export async function deleteFundraiser(id: string): Promise<void> {
  await requirePermission("manage_fundraisers");
  await db.fundraiser.delete({ where: { id } });
  revalidatePath("/fundraisers");
  redirect("/fundraisers");
}
