import { Option } from "@ghostwriter/actor";
import { TRPCError, initTRPC } from "@trpc/server";
import consola from "consola";
import { Hono } from "hono";
import { ulid } from "ulid";
import { z } from "zod";
import { Context } from "./context.js";
import { Production, productions } from "./data/content.js";
import { sql } from "./data/pg.js";
import { auth } from "./lib/lucia.js";
import { session as getSession } from "./lib/oauth.js";
import { produce } from "./production/index.js";

export const t = initTRPC.context<Context>().create();

export const router = t.router({
  vibecheck: t.procedure.query(({ ctx }) =>
    ctx.user
      ? `Hello ${ctx.user.name ?? ctx.user.username}!`
      : "Hello stranger!"
  ),

  me: t.procedure.query(async ({ ctx }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return ctx.user ?? null;
  }),

  logout: t.procedure.mutation(async ({ ctx }) => {
    if (!ctx.session) return { success: false };
    await auth.invalidateSession(ctx.session.sessionId);
    const sessionCookie = auth.createSessionCookie(null);
    ctx.headers.set("Set-Cookie", sessionCookie.serialize());
    return { success: true };
  }),

  status: t.procedure.input(z.string()).query(({ input, ctx }) => {
    if (!ctx.session)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to view this content.",
      });
    return productions.get(input) ?? null;
  }),

  newContent: t.procedure.input(Option).mutation(async ({ input, ctx }) => {
    if (!ctx.session || ctx.session.user.waitlist !== "alpha")
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to create content.",
      });

    const userId = ctx.session.user.id;

    const prev = productions
      .all()
      .filter((p) => p.userId === userId)
      .at(0);

    const active =
      !!prev && // if there is a previous production
      prev.video.status !== "done" && // and it's not done
      prev.video.status !== "error" && // and it's not errored
      new Date(prev.createdAt).getTime() > Date.now() - 1000 * 60 * 60 * 24; // and it was created in the last 24 hours

    if (active) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "You can only have one production at a time. Please wait.",
      });
    }

    await sql("update users u set usages = u.usages + 1 where u.id = $1", [
      userId,
    ]);

    const id = ulid();
    produce(id, userId, input);

    return {
      id,
    };
  }),
});

export const streamRouter = new Hono().get("/status/:id", async (c) => {
  const id = c.req.param("id");
  consola.info("streaming video of", id);
  if (!id) {
    return c.text("No id", 400);
  }
  const session = await getSession(c.req.raw);
  if (!session) {
    return c.text("Unauthorized", 401);
  }

  const key = `status:${id}`;
  const closing = `status:${id}:close`;

  const status = productions.get(id);
  if (!status) {
    return c.text("Not found", 404);
  }

  if (status.video.status === "done" || status.video.status === "error") {
    return c.streamText(async (stream) => {
      await stream.writeln(`${JSON.stringify(status)}`);
    });
  }

  return c.streamText(async (stream) => {
    await stream.writeln(`${JSON.stringify(status)}`);

    const interval = setInterval(() => {
      stream.writeln("ping");
    }, 4000);

    const fun = (data: Production) => {
      stream.writeln(`${JSON.stringify(data)}`);
    };

    productions.ee.on(key, fun);

    await new Promise((resolve) => {
      const close = () => {
        productions.ee.off(key, fun);
        productions.ee.off(closing, close);
        clearInterval(interval);
        resolve({});
      };
      productions.ee.on(closing, close);
    });
  });
});
