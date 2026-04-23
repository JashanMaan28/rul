"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ASSIGNABLE_ROLES, ROLE_DESCRIPTIONS } from "~/lib/roles";
import type { Role } from "../../../generated/prisma";
import { updateUserRoles } from "./_actions";

type Props = {
  userId: string;
  currentRoles: Role[];
  label: string;
  disabled?: boolean;
};

export function RolesEditor({ userId, currentRoles, label, disabled }: Props) {
  const [roles, setRoles] = useState<Role[]>(currentRoles);
  const [pending, startTransition] = useTransition();

  function toggle(role: Role, checked: boolean) {
    const next = checked
      ? Array.from(new Set([...roles, role]))
      : roles.filter((r) => r !== role);
    const previous = roles;
    setRoles(next);
    startTransition(async () => {
      const result = await updateUserRoles({ userId, roles: next });
      if (result.ok) {
        setRoles(result.roles);
        toast.success(`${label}: ${result.roles.join(", ")}`);
      } else {
        setRoles(previous);
        toast.error(result.error);
      }
    });
  }

  const summary = roles.length
    ? roles.length === 1
      ? roles[0]
      : `${roles.length} roles`
    : "No roles";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="btn btn-ghost btn-sm"
        disabled={disabled === true || pending}
        style={{ width: 180, justifyContent: "space-between" }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {summary}
        </span>
        <ChevronDown size={14} style={{ opacity: 0.6, flexShrink: 0 }} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[260px]">
        {ASSIGNABLE_ROLES.map((role) => (
          <DropdownMenuCheckboxItem
            key={role}
            checked={roles.includes(role)}
            onCheckedChange={(checked) => toggle(role, checked)}
            closeOnClick={false}
          >
            <div className="flex flex-col">
              <span className="font-medium">{role}</span>
              <span className="text-muted-foreground text-xs">
                {ROLE_DESCRIPTIONS[role]}
              </span>
            </div>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
