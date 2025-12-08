import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { COOKIE_NAME } from "@shared/const";
import { jwtVerify } from "jose";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;
  const token = opts.req.cookies?.[COOKIE_NAME];

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
      const { payload } = await jwtVerify(token, secret);

      if (payload.sub) {
        // Fetch user from DB
        const { getDb } = await import("../db");
        const db = await getDb();
        if (db) {
          const { users } = await import("../../drizzle/schema");
          const { eq } = await import("drizzle-orm");

          const [foundUser] = await db.select().from(users).where(eq(users.id, parseInt(payload.sub)));
          if (foundUser) {
            user = foundUser;
          }
        }
      }
    } catch (error) {
      // Invalid token or expired
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
