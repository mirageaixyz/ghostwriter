import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { trpcServer } from "@hono/trpc-server";
import consola from "consola";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createContext } from "./context.js";
import { env } from "./lib/env.js";
import { oauth } from "./lib/oauth.js";
import { router } from "./router.js";
import "./scheduler.js";

const app = new Hono();

app.use("/*", async (c, next) => {
  consola.info(`[${c.req.method}] ${c.req.url}`);
  await next();
});

app.use(
  "/*",
  cors({
    allowMethods: ["GET", "POST", "PUT", "OPTIONS"],
    credentials: true,
    origin: [
      "http://localhost:3000",
      "http://localhost:4000",
      "http://localhost:5173",
    ],
  })
);

app.use(
  "/trpc/*",
  trpcServer({
    router,
    createContext,
  })
);

app.route("/oauth", oauth);

app.get(
  "/out/*",
  serveStatic({
    root: "./",
    rewriteRequestPath: (path) => path.replace(/^\/out/, "/out"),
  })
);

serve({
  fetch: app.fetch,
  port: env.PORT,
});
