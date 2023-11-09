import { github as githubAuth } from "@lucia-auth/oauth/providers";
import { lucia } from "lucia";
import { web } from "lucia/middleware";
import { adapter as pgAdapter } from "../data/pg.js";
import { adapter as redisAdapter } from "../data/redis.js";
import { env } from "./env.js";

export const auth = lucia({
  adapter: {
    user: pgAdapter(),
    session: redisAdapter(),
  },
  env: env.NODE_ENV,
  middleware: web(),
  sessionCookie: {
    expires: false,
  },
  csrfProtection:
    env.NODE_ENV === "PROD"
      ? {
          allowedSubDomains: ["ghostwriter"],
        }
      : false,
});

export const github = githubAuth(auth, {
  clientId: env.GITHUB_CLIENT_ID,
  clientSecret: env.GITHUB_CLIENT_SECRET,
});

export type Auth = typeof auth;
