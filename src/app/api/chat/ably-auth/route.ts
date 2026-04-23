import { NextResponse } from "next/server";
import { requireUser } from "~/lib/user";
import { ablyRest, channelNameForRoom } from "~/server/ably";
import {
  ensureDefaultRoomsAndMembership,
  listAccessibleRoomsFor,
} from "~/server/chat";
import { can } from "~/lib/roles";

export async function GET() {
  try {
    const user = await requireUser();
    await ensureDefaultRoomsAndMembership(user);

    const rooms = await listAccessibleRoomsFor(user);
    const canModerate = can(user.roles, "moderate_chat");

    // Build Ably capability: every accessible channel gets subscribe + publish
    // for the current user. Moderators also get `history` (they do anyway via
    // Postgres queries — this is just symmetric for client-side convenience).
    const capability: Record<string, string[]> = {};
    for (const room of rooms) {
      const name = channelNameForRoom(room.slug);
      capability[name] = canModerate
        ? ["subscribe", "publish", "presence", "history"]
        : ["subscribe", "publish", "presence"];
    }

    const tokenRequest = await ablyRest().auth.createTokenRequest({
      clientId: user.id,
      capability: JSON.stringify(capability),
      ttl: 60 * 60 * 1000, // 1 hour
    });

    return NextResponse.json(tokenRequest);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
