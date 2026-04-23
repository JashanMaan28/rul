import "server-only";

import { db } from "~/server/db";
import {
  computeMonthlyStandings,
  monthRange,
  type MonthStandings,
} from "~/server/standings";

/**
 * Snapshot the leaderboard for a given month into `MonthlyArchive`. Idempotent
 * — replays overwrite the same (year, month) row.
 *
 * Call this on the 1st of each month (cron) to freeze last month's standings
 * before trophies reset.
 */
export async function rolloverMonth(
  year: number,
  month: number,
): Promise<void> {
  const range = monthRange(year, month);
  const standings = await computeMonthlyStandings(range);

  await db.monthlyArchive.upsert({
    where: { year_month: { year, month } },
    create: { year, month, snapshot: standings },
    update: { snapshot: standings, closedAt: new Date() },
  });
}

export function parseArchiveSnapshot(value: unknown): MonthStandings {
  if (
    value &&
    typeof value === "object" &&
    "community" in value &&
    "pro" in value
  ) {
    const v = value;
    if (Array.isArray(v.community) && Array.isArray(v.pro)) {
      return v as MonthStandings;
    }
  }
  return { community: [], pro: [] };
}
