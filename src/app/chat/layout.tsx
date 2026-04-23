import { notFound } from "next/navigation";
import { getCurrentUser } from "~/lib/user";
import { listAccessibleRoomsFor } from "~/server/chat";
import { db } from "~/server/db";
import { can } from "~/lib/roles";
import { Role } from "../../../generated/prisma";
import { ChatSidebar } from "./_sidebar";
import { AblyChatProvider } from "./_ably-provider";

export const metadata = {
  title: "Chat",
  description: "Club chat — rooms and officer DMs.",
};

const OFFICER_ROLES: Role[] = [
  Role.FOUNDER,
  Role.ADMIN,
  Role.OFFICER_ALL,
  Role.OFFICER_MINUTES,
  Role.OFFICER_GAMES,
  Role.OFFICER_POLLS,
  Role.OFFICER_FUNDRAISERS,
];

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) notFound();

  const rooms = await listAccessibleRoomsFor(user);
  const canDm = can(user.roles, "can_dm");

  const officers = canDm
    ? await db.user.findMany({
        where: {
          id: { not: user.id },
          roles: { hasSome: OFFICER_ROLES },
        },
        select: { id: true, displayName: true, avatarUrl: true, roles: true },
        orderBy: { displayName: "asc" },
      })
    : [];

  return (
    <AblyChatProvider>
      <div className="chat-shell">
        <ChatSidebar
          rooms={rooms.map((r) => ({
            id: r.id,
            slug: r.slug,
            name: r.name,
            kind: r.kind,
            isOfficerOnly: r.isOfficerOnly,
            otherMember: r.members[0]?.user ?? null,
            unreadCount: r.unreadCount,
          }))}
          officers={officers}
          currentUserId={user.id}
        />
        <main className="chat-main">{children}</main>
      </div>
    </AblyChatProvider>
  );
}
