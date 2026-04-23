import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { getCurrentUser } from "~/lib/user";
import { can, sortRoles } from "~/lib/roles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { RolesEditor } from "./roles-editor";

export const metadata: Metadata = {
  title: "Admin",
  description: "Founders and Co-Presidents can assign officer roles here.",
};

export default async function AdminPage() {
  const actor = await getCurrentUser();
  if (!actor || !can(actor.roles, "access_admin")) notFound();

  const canManageRoles = can(actor.roles, "manage_roles");

  const users = await db.user.findMany({
    orderBy: [{ displayName: "asc" }],
  });

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex flex-col gap-1">
        <div className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
          {sortRoles(actor.roles)[0]} console
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Role assignments</h1>
        <p className="text-muted-foreground text-sm">
          Members can hold multiple roles — effective permissions are the union.
          Founders and Co-Presidents have identical permissions; the FOUNDER
          badge is honorary and is seeded from the <code>FOUNDER_EMAILS</code>{" "}
          env var, not assignable here.
        </p>
      </div>

      <div className="bg-card rounded-2xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead className="w-[220px] text-right">Assign</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => {
              const isFounder = u.roles.includes("FOUNDER");
              return (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.displayName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.email}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {sortRoles(u.roles).map((r) => (
                        <Badge
                          key={r}
                          variant={r === "MEMBER" ? "secondary" : "default"}
                        >
                          {r}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {isFounder ? (
                      <span className="text-muted-foreground text-xs">
                        Seeded via env
                      </span>
                    ) : (
                      <RolesEditor
                        userId={u.id}
                        currentRoles={u.roles}
                        label={u.displayName}
                        disabled={!canManageRoles}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-muted-foreground py-8 text-center"
                >
                  No members yet. Invite officers to sign in.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
