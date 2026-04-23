import "server-only";

/**
 * Placeholder standings computation. Returns empty arrays until the
 * `Game` / `GamePlayer` models are added (pending win-model decision in
 * `docs/games-win-model.md`).
 *
 * When implemented: query `GamePlayer.isWinner` grouped by user, filtered to
 * games played during [start, end) by type, and return the top-N.
 */

export type StandingRow = {
  userId: string;
  displayName: string;
  wins: number;
};

export type MonthStandings = {
  community: StandingRow[];
  pro: StandingRow[];
};

export type MonthRange = {
  /** Inclusive start */
  start: Date;
  /** Exclusive end */
  end: Date;
};

export function monthRange(year: number, month: number): MonthRange {
  return {
    start: new Date(Date.UTC(year, month - 1, 1)),
    end: new Date(Date.UTC(year, month, 1)),
  };
}

export async function computeMonthlyStandings(
  _range: MonthRange,
): Promise<MonthStandings> {
  // TODO(games): replace with real Prisma aggregation once Game models land.
  return { community: [], pro: [] };
}
