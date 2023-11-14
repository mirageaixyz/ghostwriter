import { Option } from "@ghostwriter/actor";
import { TRPCError, initTRPC } from "@trpc/server";
import { ulid } from "ulid";
import { z } from "zod";
import { Context } from "./context.js";
import { productions } from "./data/content.js";
import { sql } from "./data/pg.js";
import { auth } from "./lib/lucia.js";
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

    await sql("update users set usages = usages + 1 where u.id = $1", [
      ctx.session.user.id,
    ]);

    const id = ulid();
    produce(id, input);

    return {
      id,
    };
  }),
});
