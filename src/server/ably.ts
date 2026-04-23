import "server-only";
import Ably from "ably";
import { env } from "~/env";

let client: Ably.Rest | null = null;

/** Server-side Ably REST client (for token requests + publishing). */
export function ablyRest(): Ably.Rest {
  client ??= new Ably.Rest({ key: env.ABLY_API_KEY });
  return client;
}

export function channelNameForRoom(roomSlug: string): string {
  return `chat:room:${roomSlug}`;
}
