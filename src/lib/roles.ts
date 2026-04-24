import { Role } from "../../generated/prisma/browser";

export type Permission =
  | "manage_roles"
  | "record_games"
  | "manage_prizes"
  | "create_polls"
  | "close_polls"
  | "write_minutes"
  | "manage_fundraisers"
  | "access_admin";

/**
 * Source of truth for role → permission mapping. Users may hold multiple roles
 * (see `User.roles` in the Prisma schema); effective permissions are the union
 * across all their roles.
 */
const MATRIX: Record<Role, ReadonlyArray<Permission>> = {
  FOUNDER: [
    "manage_roles",
    "record_games",
    "manage_prizes",
    "create_polls",
    "close_polls",
    "write_minutes",
    "manage_fundraisers",
    "access_admin",
  ],
  ADMIN: [
    "manage_roles",
    "record_games",
    "manage_prizes",
    "create_polls",
    "close_polls",
    "write_minutes",
    "manage_fundraisers",
    "access_admin",
  ],
  OFFICER_ALL: [
    "record_games",
    "manage_prizes",
    "create_polls",
    "close_polls",
    "write_minutes",
    "manage_fundraisers",
  ],
  OFFICER_MINUTES: ["write_minutes"],
  OFFICER_GAMES: ["record_games", "manage_prizes"],
  OFFICER_POLLS: ["create_polls", "close_polls"],
  OFFICER_FUNDRAISERS: ["manage_fundraisers"],
  ADVISOR: [],
  MEMBER: [],
};

/** True if any of the given roles grants the permission. */
export function can(
  roles: ReadonlyArray<Role>,
  permission: Permission,
): boolean {
  return roles.some((r) => MATRIX[r].includes(permission));
}

/** True if any of the roles grants any of the permissions. */
export function canAny(
  roles: ReadonlyArray<Role>,
  permissions: ReadonlyArray<Permission>,
): boolean {
  return permissions.some((p) => can(roles, p));
}

/** All permissions a set of roles confers, de-duplicated. */
export function permissionsFor(
  roles: ReadonlyArray<Role>,
): ReadonlyArray<Permission> {
  const set = new Set<Permission>();
  for (const r of roles) for (const p of MATRIX[r]) set.add(p);
  return Array.from(set);
}

// FOUNDER is deliberately excluded: it is only granted by env seeding
// (`FOUNDER_EMAILS` on first sign-in), never assignable through the admin UI.
export const ASSIGNABLE_ROLES = [
  "ADMIN",
  "OFFICER_ALL",
  "OFFICER_MINUTES",
  "OFFICER_GAMES",
  "OFFICER_POLLS",
  "OFFICER_FUNDRAISERS",
  "ADVISOR",
  "MEMBER",
] as const satisfies ReadonlyArray<Role>;

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  FOUNDER: "Full access + assign roles (honorary founder badge)",
  ADMIN: "Full access + assign roles",
  OFFICER_ALL: "All officer actions, cannot reassign roles",
  OFFICER_MINUTES: "Post and edit meeting minutes",
  OFFICER_GAMES: "Record games and manage monthly prizes",
  OFFICER_POLLS: "Create and close polls; post announcements",
  OFFICER_FUNDRAISERS: "Create and manage fundraising campaigns",
  ADVISOR: "Badge only, view-only",
  MEMBER: "Vote, view leaderboard, read minutes",
};

/** Role priority for display (higher index = less prestigious). */
const ROLE_DISPLAY_ORDER: Role[] = [
  Role.FOUNDER,
  Role.ADMIN,
  Role.OFFICER_ALL,
  Role.OFFICER_MINUTES,
  Role.OFFICER_GAMES,
  Role.OFFICER_POLLS,
  Role.OFFICER_FUNDRAISERS,
  Role.ADVISOR,
  Role.MEMBER,
];

export function sortRoles(roles: ReadonlyArray<Role>): Role[] {
  return [...roles].sort(
    (a, b) => ROLE_DISPLAY_ORDER.indexOf(a) - ROLE_DISPLAY_ORDER.indexOf(b),
  );
}

/** The "primary" role for a user — highest-priority one they hold. */
export function primaryRole(roles: ReadonlyArray<Role>): Role {
  return sortRoles(roles)[0] ?? Role.MEMBER;
}

