import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { trpcServer } from "@hono/trpc-server";
import consola from "consola";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createContext } from "./context.js";
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
    allowMethods: ["GET", "POST", "OPTIONS"],
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

app.get(
  "/out/*",
  serveStatic({
    root: "./",
    rewriteRequestPath: (path) => path.replace(/^\/out/, "/out"),
  })
);

serve({
  fetch: app.fetch,
  port: 4000,
});
