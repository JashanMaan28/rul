import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/profile(.*)",
  // `/officers` (plural) is the public roster page and intentionally
  // unprotected; a future officer-only area should add a properly scoped
  // matcher (e.g. `/officer/(.*)`) rather than `/officer(.*)` which collides
  // with `/officers`.
]);

// API + webhook + auth routes legitimately need `no-store` (mutation responses,
// signed webhook payloads, OAuth callbacks). Page routes do not — and Next's
// default `no-store` for dynamic pages disqualifies them from the browser's
// back/forward cache. We swap to a still-private directive that allows bfcache.
const isNoCacheRoute = createRouteMatcher([
  "/api/(.*)",
  "/trpc/(.*)",
  "/sign-in(.*)/sso-callback(.*)",
  "/sign-up(.*)/sso-callback(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  if (isNoCacheRoute(req)) return;

  const res = NextResponse.next();
  res.headers.set(
    "Cache-Control",
    "private, no-cache, max-age=0, must-revalidate",
  );
  return res;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
