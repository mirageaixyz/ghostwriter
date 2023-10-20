import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { createContext } from "./context.js";
import { appRouter } from "./router.js";
import "./scheduler.js";

const app = new Hono();

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
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
