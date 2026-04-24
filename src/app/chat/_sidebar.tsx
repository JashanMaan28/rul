"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Hash, Lock, Users, Plus } from "lucide-react";
import { Ava } from "~/components/primitives";
import type { Role } from "../../../generated/prisma";
import { RoleColoredName } from "./_role-colored-name";
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
    roles: Role[];
  } | null;
  unreadCount: number;
};

type Officer = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  roles: Role[];
};

function initials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

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
    <aside className="chat-sidebar">
      <div className="chat-sidebar-group">
        <div className="chat-sidebar-group-head">Rooms</div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {namedRooms.map((room) => {
            const active = activeSlug === room.slug;
            return (
              <li key={room.id}>
                <Link
                  href={`/chat/${room.slug}`}
                  className="chat-nav-item"
                  data-active={active}
                  style={{ textDecoration: "none" }}
                >
                  {room.isOfficerOnly ? <Lock size={14} /> : <Hash size={14} />}
                  <span className="chat-nav-item-label">
                    {room.name.replace(/^#/, "")}
                  </span>
                  {!active && room.unreadCount > 0 ? (
                    <span className="chat-nav-item-trailing chat-unread-pill">
                      {room.unreadCount > 50 ? "50+" : room.unreadCount}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {dmRooms.length > 0 ? (
        <div className="chat-sidebar-group">
          <div className="chat-sidebar-group-head">Direct messages</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {dmRooms.map((room) => {
              const active = activeSlug === room.slug;
              const name = room.otherMember?.displayName ?? "Unknown";
              const roles = room.otherMember?.roles ?? [];
              return (
                <li key={room.id}>
                  <Link
                    href={`/chat/${room.slug}`}
                    className="chat-nav-item"
                    data-active={active}
                    style={{ textDecoration: "none" }}
                  >
                    <Ava init={initials(name)} size={22} />
                    <span className="chat-nav-item-label">
                      <RoleColoredName name={name} roles={roles} />
                    </span>
                    {!active && room.unreadCount > 0 ? (
                      <span className="chat-nav-item-trailing chat-unread-pill">
                        {room.unreadCount > 50 ? "50+" : room.unreadCount}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {officers.length > 0 ? (
        <div className="chat-sidebar-group">
          <div className="chat-sidebar-group-head">
            <Users size={12} />
            Officers
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {officersWithoutDm.map((officer) => (
              <li key={officer.id}>
                <button
                  type="button"
                  className="chat-nav-item chat-nav-add"
                  disabled={pending}
                  onClick={() => openDm(officer.id)}
                >
                  <Plus size={14} />
                  <span className="chat-nav-item-label">
                    <RoleColoredName
                      name={officer.displayName}
                      roles={officer.roles}
                    />
                  </span>
                </button>
              </li>
            ))}
            {officersWithoutDm.length === 0 ? (
              <li className="chat-sidebar-empty">
                You have DMs with every officer.
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}
