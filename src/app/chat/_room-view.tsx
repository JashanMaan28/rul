"use client";

import { useEffect, useRef, useState } from "react";
import { useChannel } from "ably/react";
import { toast } from "sonner";
import { Trash2, VolumeX } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import {
  deleteMessage,
  markRoomRead,
  muteUser,
  sendMessage,
  unmuteUser,
} from "./_actions";

type Author = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
};

type Message = {
  id: string;
  content: string;
  createdAt: string;
  deletedAt: string | null;
  author: Author;
};

export function ChatRoomView({
  roomId,
  channelName,
  initialMessages,
  currentUserId,
  canModerate,
}: {
  roomId: string;
  channelName: string;
  initialMessages: Message[];
  currentUserId: string;
  canModerate: boolean;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useChannel(channelName, (ablyMessage) => {
    if (ablyMessage.name === "message") {
      const payload = ablyMessage.data as Message;
      setMessages((prev) =>
        prev.some((m) => m.id === payload.id) ? prev : [...prev, payload],
      );
    } else if (ablyMessage.name === "delete") {
      const { id } = ablyMessage.data as { id: string };
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, deletedAt: new Date().toISOString() } : m,
        ),
      );
    }
  });

  useEffect(() => {
    // Keep scroll pinned to bottom on new messages.
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length]);

  useEffect(() => {
    void markRoomRead(roomId);
  }, [roomId]);

  async function onSend() {
    const content = draft.trim();
    if (!content || sending) return;
    setSending(true);
    const result = await sendMessage({ roomId, content });
    if (result.ok) {
      setDraft("");
    } else {
      toast.error(result.error);
    }
    setSending(false);
  }

  async function onDelete(id: string) {
    try {
      await deleteMessage(id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete");
    }
  }

  async function onMute(userId: string, minutes: number | null) {
    const result = await muteUser({
      userId,
      roomId,
      minutes: minutes ?? undefined,
    });
    if (!result.ok) {
      toast.error(result.error ?? "Couldn't mute");
      return;
    }
    toast.success(
      minutes ? `Muted for ${formatDuration(minutes)}` : "Muted indefinitely",
    );
  }

  async function onUnmute(userId: string) {
    try {
      await unmuteUser({ userId, roomId });
      toast.success("Unmuted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't unmute");
    }
  }

  return (
    <>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
        {messages.length === 0 ? (
          <p className="text-muted-foreground py-10 text-center text-sm">
            No messages yet. Say hi.
          </p>
        ) : (
          <ul className="space-y-4">
            {messages.map((m) => (
              <MessageRow
                key={m.id}
                message={m}
                isSelf={m.author.id === currentUserId}
                canModerate={canModerate}
                onDelete={onDelete}
                onMute={onMute}
                onUnmute={onUnmute}
              />
            ))}
          </ul>
        )}
      </div>

      <div className="border-t p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void onSend();
          }}
          className="flex items-end gap-2"
        >
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void onSend();
              }
            }}
            rows={1}
            maxLength={4000}
            placeholder="Write a message… (Enter to send, Shift+Enter for newline)"
            className="min-h-[40px] resize-none"
          />
          <Button type="submit" disabled={sending || !draft.trim()}>
            Send
          </Button>
        </form>
      </div>
    </>
  );
}

function MessageRow({
  message,
  isSelf,
  canModerate,
  onDelete,
  onMute,
  onUnmute,
}: {
  message: Message;
  isSelf: boolean;
  canModerate: boolean;
  onDelete: (id: string) => void;
  onMute: (userId: string, minutes: number | null) => void;
  onUnmute: (userId: string) => void;
}) {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const isDeleted = !!message.deletedAt;
  const canMuteAuthor = canModerate && !isSelf;

  const nameClass = cn(
    "text-sm font-semibold",
    isSelf && "text-[color:var(--uno-red)]",
  );

  return (
    <li className="group flex items-start gap-3">
      <Avatar className="size-8 shrink-0">
        <AvatarImage src={message.author.avatarUrl ?? undefined} alt="" />
        <AvatarFallback className="text-xs">
          {message.author.displayName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          {canMuteAuthor ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  nameClass,
                  "focus-visible:ring-ring rounded hover:underline focus:outline-none focus-visible:ring-2",
                )}
              >
                {message.author.displayName}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44">
                <div className="text-muted-foreground px-1.5 py-1 text-xs font-medium">
                  Moderate {message.author.displayName}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onMute(message.author.id, 10)}>
                  <VolumeX />
                  Mute 10 min
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMute(message.author.id, 60)}>
                  <VolumeX />
                  Mute 1 hour
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onMute(message.author.id, 60 * 24)}
                >
                  <VolumeX />
                  Mute 1 day
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onMute(message.author.id, null)}
                >
                  <VolumeX />
                  Mute indefinitely
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onUnmute(message.author.id)}>
                  Unmute
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <span className={nameClass}>{message.author.displayName}</span>
          )}
          <span className="text-muted-foreground text-xs">{time}</span>
        </div>
        {isDeleted ? (
          <p className="text-muted-foreground text-sm italic">
            [message deleted by a moderator]
          </p>
        ) : (
          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
            {message.content}
          </p>
        )}
      </div>
      {canModerate && !isDeleted ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(message.id)}
          className="opacity-0 transition-opacity group-hover:opacity-100"
          aria-label="Delete message"
        >
          <Trash2 className="size-4" />
        </Button>
      ) : null}
    </li>
  );
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 60 * 24) return `${minutes / 60} hr`;
  return `${minutes / (60 * 24)} day`;
}
