"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";

const schema = z.object({
  email: z.string().email().max(200),
  topic: z.string().min(1).max(40).default("leaderboard"),
});

export type SubscribeResult = { ok: true } | { ok: false; error: string };

export async function subscribeToNotify(input: {
  email: string;
  topic?: string;
}): Promise<SubscribeResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Enter a valid email." };
  }
  const { userId } = await auth();

  try {
    await db.notifySubscription.upsert({
      where: {
        email_topic: { email: parsed.data.email, topic: parsed.data.topic },
      },
      create: {
        email: parsed.data.email,
        topic: parsed.data.topic,
        userId: userId ?? null,
      },
      update: { userId: userId ?? null },
    });
    return { ok: true };
  } catch (err) {
    console.error("[notify] subscribe failed", err);
    return { ok: false, error: "Couldn't save — try again later." };
  }
}
