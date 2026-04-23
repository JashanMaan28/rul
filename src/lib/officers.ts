export type OfficerRoleKey =
  | "FOUNDER"
  | "ADMIN"
  | "OFFICER_ALL"
  | "OFFICER_MINUTES"
  | "OFFICER_GAMES"
  | "OFFICER_POLLS"
  | "OFFICER_FUNDRAISERS"
  | "ADVISOR"
  | "MEMBER";

export type Officer = {
  name: string;
  title: string;
  role: OfficerRoleKey;
  accent: "red" | "yellow" | "green" | "blue";
};

export const OFFICERS: ReadonlyArray<Officer> = [
  {
    name: "Jashanpreet Singh",
    title: "Honorary Founder",
    role: "FOUNDER",
    accent: "yellow",
  },
  { name: "Ajit Johal", title: "Co-President", role: "ADMIN", accent: "red" },
  {
    name: "Morgan McDonald",
    title: "Co-President",
    role: "ADMIN",
    accent: "red",
  },
  {
    name: "Veer Dhaliwal",
    title: "Vice President",
    role: "OFFICER_ALL",
    accent: "blue",
  },
  {
    name: "Gurtej Lalli",
    title: "Treasurer",
    role: "OFFICER_GAMES",
    accent: "green",
  },
  {
    name: "Landen Morse",
    title: "Publicity Officer",
    role: "OFFICER_POLLS",
    accent: "yellow",
  },
  {
    name: "Beauross Yan",
    title: "Secretary",
    role: "OFFICER_MINUTES",
    accent: "blue",
  },
  {
    name: "Robert Kissee",
    title: "Teacher Rep",
    role: "OFFICER_ALL",
    accent: "green",
  },
];

export const ROLE_LABEL: Record<OfficerRoleKey, string> = {
  FOUNDER: "Founder",
  ADMIN: "Admin",
  OFFICER_ALL: "Officer",
  OFFICER_MINUTES: "Secretary",
  OFFICER_GAMES: "Game Recorder",
  OFFICER_POLLS: "Publicity",
  OFFICER_FUNDRAISERS: "Fundraiser",
  ADVISOR: "Advisor",
  MEMBER: "Member",
};
