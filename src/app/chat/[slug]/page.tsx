import { notFound } from "next/navigation";
import { Hash, Lock } from "lucide-react";
import { db } from "~/server/db";
import { getCurrentUser } from "~/lib/user";
import { can } from "~/lib/roles";
import { channelNameForRoom } from "~/server/ably";
import { ChatChannelProvider } from "../_ably-provider";
import { ChatRoomView } from "../_room-view";

export default async function ChatRoomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUser();
  if (!user) notFound();

  const room = await db.chatRoom.findUnique({
    where: { slug },
    include: {
      members: {
        where: { userId: { not: user.id } },
        select: {
          user: { select: { id: true, displayName: true, avatarUrl: true } },
        },
      },
    },
  });
  if (!room) notFound();

  const isMember = await db.chatRoomMember.findUnique({
    where: { roomId_userId: { roomId: room.id, userId: user.id } },
  });
  if (!isMember) notFound();

  const canModerate = can(user.roles, "moderate_chat");

  const messages = await db.chatMessage.findMany({
    where: { roomId: room.id },
    orderBy: { createdAt: "asc" },
    take: 200,
    include: {
      author: {
        select: { id: true, displayName: true, avatarUrl: true },
      },
    },
  });

  const headerName =
    room.kind === "DM"
      ? (room.members[0]?.user.displayName ?? "Direct message")
      : room.name.replace(/^#/, "");

  return (
    <ChatChannelProvider channelName={channelNameForRoom(room.slug)}>
      <div className="flex h-[calc(100vh-8rem)] flex-col">
        <header className="flex items-center gap-2 border-b px-5 py-3">
          {room.kind === "DM" ? null : room.isOfficerOnly ? (
            <Lock className="text-muted-foreground size-4" />
          ) : (
            <Hash className="text-muted-foreground size-4" />
          )}
          <h1 className="truncate font-semibold">{headerName}</h1>
          {room.description ? (
            <span className="text-muted-foreground ml-3 truncate text-xs">
              {room.description}
            </span>
          ) : null}
        </header>

        <ChatRoomView
          roomId={room.id}
          channelName={channelNameForRoom(room.slug)}
          initialMessages={messages.map((m) => ({
            id: m.id,
            content: m.content,
            createdAt: m.createdAt.toISOString(),
            deletedAt: m.deletedAt?.toISOString() ?? null,
            author: m.author,
          }))}
          currentUserId={user.id}
          canModerate={canModerate}
        />
      </div>
    </ChatChannelProvider>
  );
}
