import { Option } from "@ghostwriter/actor";
import { TRPCError, initTRPC } from "@trpc/server";
import consola from "consola";
import { Hono } from "hono";
import { ulid } from "ulid";
import { z } from "zod";
import { Context } from "./context.js";
import { Production, productions } from "./data/content.js";
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

    const id = ulid();
    produce(id, input);

    return {
      id,
    };
  }),
});

export const streamRouter = new Hono().get("/status/:id", async (c) => {
  const id = c.req.param("id");
  consola.log("id", id);
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

export function cancelAll() {
  productions.all().forEach((p) => {
    const value = {
      ...p,
      video: {
        status: "done",
        uri: "/out/01HEN8H55GD1XW1N1J6H905V70.mp4",
      },
    } as const;
    productions.set(p.id, value);
    productions.ee.emit(`status:${p.id}`, value);
    setTimeout(() => {
      productions.ee.emit(`status:${p.id}:close`);
    }, 1000);
  });
}

productions.set("hello", {
  id: "hello",
  createdAt: new Date().toISOString(),
  video: {
    status: "acting",
  },
});
