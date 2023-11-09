import { pg as postgres } from "@lucia-auth/adapter-postgresql";
import { Pool, neon, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { env } from "../lib/env.js";

neonConfig.webSocketConstructor = ws;

export const sql = neon(env.NEON_DATABASE_URL);

export const pg = new Pool({ connectionString: env.NEON_DATABASE_URL });

export const adapter = () =>
  postgres(pg, {
    key: "auth_keys",
    user: "users",
    session: "",
  });
