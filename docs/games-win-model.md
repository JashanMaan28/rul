---
status: open-question
owner: jashanpreet
decided: false
---

# Game Win Model — decision pending

This document captures the three candidate models for how a recorded RUL game
translates into trophies on the leaderboard. The leaderboard page is shipped
as a "Coming Soon" until this is decided, because everything downstream
(schema, recording form, profile stats, monthly prize rollover) depends on
this choice.

Trophy rules that do NOT depend on the choice:
- Community session wins → **silver** trophy
- Pro session wins → **gold** trophy
- Trophies reset on the 1st of each month for monthly prizes
- All-time totals stick around for bragging rights

What DOES depend on the choice: how many trophies a single session produces,
what we record about non-winners, and what profile pages can show.

---

## Option A — One winner per game (simplest) *(tentative default)*

**Rule:** Exactly one player wins each round. Winner gets +1 trophy
(silver/gold by game type). Non-winners get participation only.

### Schema

```
Game       { id, type: COMMUNITY|PRO, playedAt, recordedById, notes }
GamePlayer { gameId, userId, isWinner: boolean }
```

### Recording UX

Officer selects: date/time, type, participants, and one winner radio. Done.

### Leaderboard math

```sql
-- silver trophies this month for a user
SELECT count(*) FROM "GamePlayer"
JOIN "Game" ON "Game".id = "GamePlayer"."gameId"
WHERE "userId" = :uid
  AND "isWinner" = true
  AND "Game"."type" = 'COMMUNITY'
  AND "Game"."playedAt" >= date_trunc('month', now());
```

### Pros
- Trivial to record; officers won't skip entries.
- Leaderboard math is a single indexed count.
- Profile page is obvious: wins / games / win rate.

### Cons
- Ignores the player who went 2nd vs. 8th — same participation credit.
- No "podium" concept; ties/tiebreakers can't happen.

---

## Option B — Ranked placement

**Rule:** Record full finish order (1st, 2nd, 3rd…). 1st still gets the
trophy, but the placement data powers richer profile stats and tiebreakers.

### Schema

```
Game       { id, type, playedAt, recordedById, notes }
GamePlayer { gameId, userId, placement: int }   -- 1 = winner
```

### Recording UX

Officer drags players into a finish-order list, or fills placements
sequentially. Slower than Option A but still fast.

### Leaderboard math

Identical to Option A for trophies (`placement = 1`). Profile pages can
additionally show average placement, podium count (top 3), worst finish, etc.

### Pros
- Keeps trophy logic simple but unlocks richer stats.
- Tiebreaker data (average placement, podium rate) is there for prize night.
- Makes "I almost won" moments visible on profiles.

### Cons
- Officers may under-record later placements out of laziness (only record
  winner, leave rest null). Need to decide: is placement required for all?
- Ties between 2nd-place-ish players are annoying to represent.

---

## Option C — Points-based (real UNO scoring)

**Rule:** Real UNO scoring — winner collects the point values of every other
player's remaining cards. Record per-session score per player. Trophy goes to
session-high. Profile stats show lifetime points.

### Schema

```
Game       { id, type, playedAt, recordedById, notes }
GamePlayer { gameId, userId, score: int, isWinner: boolean }
```

### Recording UX

Slowest: officer enters each player's leftover-card point total. Calculator
work at the end of every session.

### Leaderboard math

- Trophies: still count `isWinner = true` per game.
- Secondary leaderboard: sum of `score` per month → "points leader."

### Pros
- Most authentic to actual UNO scoring.
- Enables a second leaderboard (points) alongside trophies.
- Prize structure can differentiate: "most wins" vs. "most points."

### Cons
- Recording overhead is real. Officers will skip entries or guess.
- Requires everyone to agree on card values (face = face, wild = 50, +4 = 50,
  etc.). Needs documented scoring rules.
- DB migration / UI is heavier if we start here and later regret it.

---

## Recommendation

Start with **Option A**. It's the smallest thing that produces a working
leaderboard, matches what officers will actually do under time pressure, and
the schema is a subset of Option B's — we can upgrade to B later by adding a
nullable `placement` column without losing data.

Option C is appealing but high-friction; reconsider only if officers are
already recording faithfully and ask for it.

## When to pick

Decide before we build:
- `src/app/leaderboard/page.tsx` (real version)
- `src/app/officer/games/new/page.tsx` (recording form)
- Prisma models for `Game` and `GamePlayer`
