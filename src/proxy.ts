import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/profile(.*)",
  "/chat(.*)",
  // Note: /api/chat/* routes handle auth internally (requireUser) and return
  // 401 on failure rather than redirecting, so we don't wrap them in
  // middleware protection. `/officers` (plural) is the public roster page
  // and intentionally unprotected; a future officer-only area should add a
  // properly scoped matcher (e.g. `/officer/(.*)`) rather than `/officer(.*)`
  // which collides with `/officers`.
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
