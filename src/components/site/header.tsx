import { HeaderClient } from "~/components/site/header-client";
import { can } from "~/lib/roles";
import { getCurrentUser } from "~/lib/user";

const NAV_PUBLIC = [
  { href: "/", label: "Home" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/polls", label: "Vote" },
  { href: "/minutes", label: "Minutes" },
  { href: "/fundraisers", label: "Fundraisers" },
  { href: "/officers", label: "Officers" },
];

export async function Header() {
  const currentUser = await getCurrentUser();
  const showAdmin = currentUser
    ? can(currentUser.roles, "access_admin")
    : false;

  return <HeaderClient navLinks={NAV_PUBLIC} showAdmin={showAdmin} />;
}
