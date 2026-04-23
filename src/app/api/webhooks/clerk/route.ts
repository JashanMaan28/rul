import type { NextRequest } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { UserJSON, WebhookEvent } from "@clerk/backend";
import { db } from "~/server/db";
import { upsertUserFromClerk } from "~/lib/user";

/**
 * Normalize Clerk's webhook payload (snake_case `UserJSON`) into the
 * camelCase shape our `upsertUserFromClerk` helper expects.
 */
function normalize(user: UserJSON) {
  return {
    id: user.id,
    emailAddresses: user.email_addresses.map((e) => ({
      id: e.id,
      emailAddress: e.email_address,
    })),
    primaryEmailAddressId: user.primary_email_address_id,
    firstName: user.first_name,
    lastName: user.last_name,
    imageUrl: user.image_url ?? "",
  };
}

export async function POST(req: NextRequest): Promise<Response> {
  let evt: WebhookEvent;
  try {
    evt = await verifyWebhook(req);
  } catch (err) {
    console.error("[clerk-webhook] signature verification failed", err);
    return new Response("invalid signature", { status: 400 });
  }

  try {
    switch (evt.type) {
      case "user.created":
      case "user.updated": {
        await upsertUserFromClerk(normalize(evt.data));
        break;
      }
      case "user.deleted": {
        const id = evt.data.id;
        if (id) {
          await db.user.deleteMany({ where: { id } });
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error(`[clerk-webhook] failed to handle ${evt.type}`, err);
    return new Response("handler failed", { status: 500 });
  }

  return new Response(null, { status: 204 });
}
