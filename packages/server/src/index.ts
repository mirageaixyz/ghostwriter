import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { createContext } from "./context.js";
import { appRouter } from "./router.js";

const app = new Hono();

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
  })
);

serve({
  fetch: app.fetch,
  port: 4000,
});
