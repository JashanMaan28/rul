"use client";

import ShinyText from "~/components/ShinyText";
import { roleBadgeStyleFor } from "~/lib/roles";
import type { Role } from "../../../generated/prisma/browser";

export function RoleColoredName({
  name,
  roles,
}: {
  name: string;
  roles: Role[];
}) {
  const style = roleBadgeStyleFor(roles);
  if (!style) return <>{name}</>;
  if (style.shiny) {
    return (
      <ShinyText
        text={name}
        color={style.color}
        shineColor={style.shineColor ?? "#ffffff"}
        speed={3}
        spread={120}
      />
    );
  }
  return <span style={{ color: style.color }}>{name}</span>;
}
