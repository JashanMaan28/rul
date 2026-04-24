import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "~/env";
import { PrismaClient } from "../../generated/prisma/client";

/**
 * Current pg-connection-string silently aliases `prefer`/`require`/`verify-ca`
 * to `verify-full`, but warns on stderr and will switch to weaker libpq
 * semantics in pg v9. Normalize to the strict mode we were already getting so
 * behavior stays identical and the warning goes away.
 */
function normalizeSslMode(url: string): string {
  return url.replace(
    /([?&]sslmode=)(prefer|require|verify-ca)(?=&|$)/i,
    "$1verify-full",
  );
}

const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: normalizeSslMode(env.DATABASE_URL),
    }),
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
