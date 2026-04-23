"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "~/server/db";
import { requirePermission, requireUser } from "~/lib/user";

const createPollSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  options: z.array(z.string().min(1).max(200)).min(2).max(10),
  closesAt: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : null)),
});

export type CreatePollResult =
  | { ok: true; pollId: string }
  | { ok: false; error: string };

export async function createPoll(formData: FormData): Promise<void> {
  const actor = await requirePermission("create_polls");

  const rawOptions = formData.getAll("options").map(String).filter(Boolean);
  const descriptionRaw = formData.get("description");
  const closesAtRaw = formData.get("closesAt");
  const parsed = createPollSchema.safeParse({
    title: formData.get("title"),
    description:
      typeof descriptionRaw === "string" && descriptionRaw.length > 0
        ? descriptionRaw
        : undefined,
    options: rawOptions,
    closesAt:
      typeof closesAtRaw === "string" && closesAtRaw.length > 0
        ? closesAtRaw
        : undefined,
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues.map((i) => i.message).join("; ") ??
        "Invalid poll input",
    );
  }

  const poll = await db.poll.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      closesAt: parsed.data.closesAt,
      createdById: actor.id,
      options: {
        create: parsed.data.options.map((label, position) => ({
          label,
          position,
        })),
      },
    },
  });

  revalidatePath("/polls");
  redirect(`/polls/${poll.id}`);
}

export async function castVote(input: {
  pollId: string;
  pollOptionId: string;
}): Promise<{ ok: boolean; error?: string }> {
  const user = await requireUser();

  const poll = await db.poll.findUnique({
    where: { id: input.pollId },
    select: { isClosed: true, closesAt: true },
  });
  if (!poll) return { ok: false, error: "Poll not found" };
  if (poll.isClosed) return { ok: false, error: "Poll is closed" };
  if (poll.closesAt && poll.closesAt < new Date()) {
    return { ok: false, error: "Poll has ended" };
  }

  const option = await db.pollOption.findFirst({
    where: { id: input.pollOptionId, pollId: input.pollId },
    select: { id: true },
  });
  if (!option)
    return { ok: false, error: "Option doesn't belong to this poll" };

  const existing = await db.vote.findUnique({
    where: { pollId_userId: { pollId: input.pollId, userId: user.id } },
    select: { id: true },
  });
  if (existing) {
    return { ok: false, error: "You've already voted on this poll" };
  }

  await db.vote.create({
    data: {
      pollId: input.pollId,
      pollOptionId: input.pollOptionId,
      userId: user.id,
    },
  });

  revalidatePath(`/polls/${input.pollId}`);
  revalidatePath("/polls");
  return { ok: true };
}

export async function closePoll(pollId: string): Promise<void> {
  await requirePermission("close_polls");
  await db.poll.update({
    where: { id: pollId },
    data: { isClosed: true },
  });
  revalidatePath(`/polls/${pollId}`);
  revalidatePath("/polls");
}

export async function reopenPoll(pollId: string): Promise<void> {
  await requirePermission("close_polls");
  await db.poll.update({
    where: { id: pollId },
    data: { isClosed: false },
  });
  revalidatePath(`/polls/${pollId}`);
  revalidatePath("/polls");
}
