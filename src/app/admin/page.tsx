import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { getCurrentUser } from "~/lib/user";
import { can, sortRoles } from "~/lib/roles";
import { Eyebrow, Section } from "~/components/primitives";
import { RolesEditor } from "./roles-editor";

export const metadata: Metadata = {
  title: "Admin",
  description: "Founders and Co-Presidents can assign officer roles here.",
};

export default async function AdminPage() {
  const actor = await getCurrentUser();
  if (!actor || !can(actor.roles, "access_admin")) notFound();

  const canManageRoles = can(actor.roles, "manage_roles");
  const actorTopRole = sortRoles(actor.roles)[0] ?? "MEMBER";

  const users = await db.user.findMany({
    orderBy: [{ displayName: "asc" }],
  });

  return (
    <Section accent="red">
      <div className="container-page" style={{ maxWidth: 1040 }}>
        <div className="page-head">
          <div>
            <Eyebrow>{actorTopRole} console</Eyebrow>
            <h1>Role assignments.</h1>
            <p className="sub" style={{ marginTop: 10 }}>
              Members can hold multiple roles — effective permissions are the
              union. Founders and Co-Presidents have identical permissions; the
              FOUNDER badge is honorary and seeded from{" "}
              <code
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  padding: "1px 6px",
                  borderRadius: 6,
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                }}
              >
                FOUNDER_EMAILS
              </code>
              , not assignable here.
            </p>
          </div>
        </div>

        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Email</th>
                <th>Roles</th>
                <th className="cell-right" style={{ width: 220 }}>
                  Assign
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isFounder = u.roles.includes("FOUNDER");
                return (
                  <tr key={u.id}>
                    <td className="cell-name">{u.displayName}</td>
                    <td className="cell-note">{u.email}</td>
                    <td>
                      <div className="role-chip-row">
                        {sortRoles(u.roles).map((r) => (
                          <span
                            key={r}
                            className="role-chip"
                            data-role={r}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="cell-right">
                      {isFounder ? (
                        <span className="cell-note">Seeded via env</span>
                      ) : (
                        <RolesEditor
                          userId={u.id}
                          currentRoles={u.roles}
                          label={u.displayName}
                          disabled={!canManageRoles}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="cell-empty">
                    No members yet. Invite officers to sign in.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
