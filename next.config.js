/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  // Override Next's default `Cache-Control: private, no-cache, no-store, max-age=0,
  // must-revalidate` for dynamic page responses. The `no-store` token disqualifies
  // pages from the browser back/forward cache (bfcache); replacing it with
  // `private, no-cache, must-revalidate` keeps responses uncacheable on shared
  // proxies and revalidated on every navigation while letting browsers bfcache.
  //
  // API and tRPC routes are excluded so mutation responses, signed webhook
  // payloads, and OAuth callbacks still get `no-store`.
  async headers() {
    return [
      {
        source: "/((?!api/|trpc/|_next/).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default config;
