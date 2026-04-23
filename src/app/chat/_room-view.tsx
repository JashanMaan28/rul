"use client";

import { useEffect, useRef, useState } from "react";
import { useChannel } from "ably/react";
import { toast } from "sonner";
import { Trash2, VolumeX } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Ava } from "~/components/primitives";
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

function initials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

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
      <div ref={scrollRef} className="chat-messages">
        {messages.length === 0 ? (
          <p className="chat-messages-empty">No messages yet. Say hi.</p>
        ) : (
          messages.map((m) => (
            <MessageRow
              key={m.id}
              message={m}
              isSelf={m.author.id === currentUserId}
              canModerate={canModerate}
              onDelete={onDelete}
              onMute={onMute}
              onUnmute={onUnmute}
            />
          ))
        )}
      </div>

      <form
        className="chat-composer"
        onSubmit={(e) => {
          e.preventDefault();
          void onSend();
        }}
      >
        <textarea
          className="form-textarea"
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
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          className="btn btn-primary"
        >
          Send
        </button>
      </form>
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

  return (
    <div className="chat-message">
      <Ava init={initials(message.author.displayName)} size={32} />
      <div className="chat-message-body">
        <div className="chat-message-head">
          {canMuteAuthor ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="chat-message-name"
                data-moderatable="true"
                data-self={isSelf}
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
            <span className="chat-message-name" data-self={isSelf}>
              {message.author.displayName}
            </span>
          )}
          <span className="chat-message-time">{time}</span>
        </div>
        {isDeleted ? (
          <p className="chat-message-deleted">
            [message deleted by a moderator]
          </p>
        ) : (
          <p className="chat-message-text">{message.content}</p>
        )}
      </div>
      {canModerate && !isDeleted ? (
        <button
          type="button"
          onClick={() => onDelete(message.id)}
          className="chat-message-mod icon-btn icon-btn-danger"
          aria-label="Delete message"
        >
          <Trash2 size={14} />
        </button>
      ) : null}
    </div>
  );
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 60 * 24) return `${minutes / 60} hr`;
  return `${minutes / (60 * 24)} day`;
}
