import { NextResponse } from "next/server";
import { env } from "~/env";
import { rolloverMonth } from "~/server/archive";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!env.CRON_SECRET) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET not configured" },
      { status: 500 },
    );
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  // Run on the 1st of the month — snapshot the month that just ended.
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const year = target.getFullYear();
  const month = target.getMonth() + 1;

  await rolloverMonth(year, month);

  return NextResponse.json({ ok: true, year, month });
}
