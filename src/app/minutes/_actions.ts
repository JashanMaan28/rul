"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "~/server/db";
import { requirePermission } from "~/lib/user";

const minutesSchema = z.object({
  title: z.string().min(3).max(200),
  meetingAt: z
    .string()
    .min(1)
    .transform((v) => new Date(v)),
  content: z.string().min(1).max(20000),
  isPublished: z.boolean(),
});

export async function createMinutes(formData: FormData): Promise<void> {
  const actor = await requirePermission("write_minutes");

  const parsed = minutesSchema.safeParse({
    title: formData.get("title"),
    meetingAt: formData.get("meetingAt"),
    content: formData.get("content"),
    isPublished: formData.get("isPublished") === "on",
  });
  if (!parsed.success) {
    throw new Error(
      parsed.error.issues.map((i) => i.message).join("; ") ||
        "Invalid minutes input",
    );
  }

  const created = await db.meetingMinutes.create({
    data: {
      title: parsed.data.title,
      meetingAt: parsed.data.meetingAt,
      content: parsed.data.content,
      isPublished: parsed.data.isPublished,
      authorId: actor.id,
    },
  });

  revalidatePath("/minutes");
  redirect(`/minutes/${created.id}`);
}

export async function updateMinutes(
  id: string,
  formData: FormData,
): Promise<void> {
  await requirePermission("write_minutes");

  const parsed = minutesSchema.safeParse({
    title: formData.get("title"),
    meetingAt: formData.get("meetingAt"),
    content: formData.get("content"),
    isPublished: formData.get("isPublished") === "on",
  });
  if (!parsed.success) {
    throw new Error(
      parsed.error.issues.map((i) => i.message).join("; ") ||
        "Invalid minutes input",
    );
  }

  await db.meetingMinutes.update({
    where: { id },
    data: {
      title: parsed.data.title,
      meetingAt: parsed.data.meetingAt,
      content: parsed.data.content,
      isPublished: parsed.data.isPublished,
    },
  });

  revalidatePath("/minutes");
  revalidatePath(`/minutes/${id}`);
  redirect(`/minutes/${id}`);
}

export async function deleteMinutes(id: string): Promise<void> {
  await requirePermission("write_minutes");
  await db.meetingMinutes.delete({ where: { id } });
  revalidatePath("/minutes");
  redirect("/minutes");
}
