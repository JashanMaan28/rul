"use client";

import { useMemo } from "react";
import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";

/**
 * Thin wrapper around ably/react's AblyProvider. Auth is via the server-side
 * `/api/chat/ably-auth` endpoint which mints scoped tokens from the user's
 * Clerk session.
 */
export function AblyChatProvider({ children }: { children: React.ReactNode }) {
  const client = useMemo(
    () =>
      new Ably.Realtime({
        authUrl: "/api/chat/ably-auth",
        authMethod: "GET",
        autoConnect: typeof window !== "undefined",
      }),
    [],
  );

  return <AblyProvider client={client}>{children}</AblyProvider>;
}

/** Per-room channel wrapper. Each room renders its own subscription. */
export function ChatChannelProvider({
  channelName,
  children,
}: {
  channelName: string;
  children: React.ReactNode;
}) {
  return (
    <ChannelProvider channelName={channelName}>{children}</ChannelProvider>
  );
}
