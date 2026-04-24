# CLAUDE.md

## Project

Ripon Uno League (RUL) — Ripon High's UNO club site. Next.js 15 App Router + Prisma (Postgres) + Clerk + Ably. Package manager: **bun**.

## Critical Gotchas

### Prisma client location

Generated to `../generated/prisma`, **not** `@prisma/client`. Always import types/enums from the re-exporting modules — never directly from `@prisma/client`.

### TypeScript strictness

- `noUncheckedIndexedAccess: true` — `arr[i]` is `T | undefined`. Handle or assert.
- `verbatimModuleSyntax: true` — use `import { type X }` for type-only imports.

### Env vars

Import from `~/env`, **never** `process.env` directly. Validated via `@t3-oss/env-nextjs` + Zod.

## Auth + Roles

- `User.id` = Clerk user ID. Two sync paths: webhook (`/api/webhooks/clerk`) and lazy via `getCurrentUser()`.
- `FOUNDER_EMAILS` / `ADMIN_EMAILS` in env auto-seed roles on first sign-in. Seeds only apply to users still at `[MEMBER]` — never overwrite admin UI edits.
- `FOUNDER` is excluded from `ASSIGNABLE_ROLES` — only comes from `FOUNDER_EMAILS`. The admin role-update action rejects changes to any user holding FOUNDER.
- `src/lib/roles.ts` is the **single source of truth** for role → permission mapping. Use `can()` / `canAny()`. Don't hardcode role checks.
- `/api/chat/*` routes do their own auth (401, no redirect) — intentionally excluded from middleware matcher.

## Chat (Ably)

Postgres is source of truth; Ably is fan-out only. A failing Ably publish must surface as an error to the composer — don't swallow it.

## ⛔ Deferred: Games + Leaderboard

**Do not implement `Game` / `GamePlayer` models or real standings** until the win model is decided (`docs/games-win-model.md`). Current stubs in `src/server/standings.ts` and `src/server/archive.ts` are intentional placeholders.

## Conventions

- Server actions: `return { ok: false, error }` for expected failures; `throw` only for programmer errors / auth violations.
- `"server-only"` at the top of all files under `src/server/`.

## Rules

- Research reactbits, aceternity UI, and shadcn UI components before adding or replacing any UI.
