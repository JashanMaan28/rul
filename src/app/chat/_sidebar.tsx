"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Hash, Lock, Users, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { startDm } from "./_actions";

type Room = {
  id: string;
  slug: string;
  name: string;
  kind: "ROOM" | "DM";
  isOfficerOnly: boolean;
  otherMember: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  } | null;
  unreadCount: number;
};

type Officer = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
};

export function ChatSidebar({
  rooms,
  officers,
  currentUserId,
}: {
  rooms: Room[];
  officers: Officer[];
  currentUserId: string;
}) {
  const params = useParams<{ slug?: string }>();
  const activeSlug = params?.slug;
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const namedRooms = rooms.filter((r) => r.kind === "ROOM");
  const dmRooms = rooms.filter((r) => r.kind === "DM");

  const existingDmPartnerIds = new Set(
    dmRooms.map((r) => r.otherMember?.id).filter((id): id is string => !!id),
  );
  const officersWithoutDm = officers.filter(
    (o) => !existingDmPartnerIds.has(o.id) && o.id !== currentUserId,
  );

  function openDm(userId: string) {
    startTransition(async () => {
      const result = await startDm(userId);
      if (result.ok && result.slug) {
        router.push(`/chat/${result.slug}`);
        router.refresh();
      } else {
        toast.error(result.error ?? "Couldn't open DM");
      }
    });
  }

  return (
    <aside className="space-y-6 md:sticky md:top-20 md:self-start">
      <div>
        <h2 className="text-muted-foreground mb-2 px-2 text-xs font-semibold tracking-widest uppercase">
          Rooms
        </h2>
        <ul className="space-y-0.5">
          {namedRooms.map((room) => (
            <li key={room.id}>
              <Link
                href={`/chat/${room.slug}`}
                className={cn(
                  "hover:bg-muted flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
                  activeSlug === room.slug && "bg-muted",
                )}
              >
                {room.isOfficerOnly ? (
                  <Lock className="text-muted-foreground size-4" />
                ) : (
                  <Hash className="text-muted-foreground size-4" />
                )}
                <span className="truncate">{room.name.replace(/^#/, "")}</span>
                <UnreadBadge
                  count={room.unreadCount}
                  hidden={activeSlug === room.slug}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {dmRooms.length > 0 ? (
        <div>
          <h2 className="text-muted-foreground mb-2 px-2 text-xs font-semibold tracking-widest uppercase">
            Direct messages
          </h2>
          <ul className="space-y-0.5">
            {dmRooms.map((room) => (
              <li key={room.id}>
                <Link
                  href={`/chat/${room.slug}`}
                  className={cn(
                    "hover:bg-muted flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                    activeSlug === room.slug && "bg-muted",
                  )}
                >
                  <Avatar className="size-6">
                    <AvatarImage
                      src={room.otherMember?.avatarUrl ?? undefined}
                      alt=""
                    />
                    <AvatarFallback className="text-[10px]">
                      {(room.otherMember?.displayName ?? "?")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">
                    {room.otherMember?.displayName ?? "Unknown"}
                  </span>
                  <UnreadBadge
                    count={room.unreadCount}
                    hidden={activeSlug === room.slug}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {officers.length > 0 ? (
        <div>
          <h2 className="text-muted-foreground mb-2 flex items-center gap-1 px-2 text-xs font-semibold tracking-widest uppercase">
            <Users className="size-3.5" />
            Officers
          </h2>
          <ul className="space-y-0.5">
            {officersWithoutDm.map((officer) => (
              <li key={officer.id}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto w-full justify-start px-2 py-1.5 font-normal"
                  disabled={pending}
                  onClick={() => openDm(officer.id)}
                >
                  <Plus className="text-muted-foreground size-3.5" />
                  <span className="truncate">{officer.displayName}</span>
                </Button>
              </li>
            ))}
            {officersWithoutDm.length === 0 ? (
              <li className="text-muted-foreground px-2 py-1 text-xs">
                You have DMs with every officer.
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}

function UnreadBadge({ count, hidden }: { count: number; hidden: boolean }) {
  if (hidden || count <= 0) return null;
  return (
    <span className="ml-auto min-w-5 rounded-full bg-[color:var(--uno-red)] px-1.5 text-center text-[11px] leading-5 font-semibold text-white">
      {count > 50 ? "50+" : count}
    </span>
  );
}
