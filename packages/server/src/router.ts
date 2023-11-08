import { Option } from "@ghostwriter/actor";
import { initTRPC } from "@trpc/server";
import { ulid } from "ulid";
import { z } from "zod";
import { Context } from "./context.js";
import { productions } from "./data/content.js";
import { produce } from "./production/index.js";

export const t = initTRPC.context<Context>().create();

export const router = t.router({
  vibecheck: t.procedure.query(() => "Hello"),

  status: t.procedure
    .input(z.string())
    .query(({ input }) => productions.get(input) ?? null),

  newContent: t.procedure.input(Option).mutation(async ({ input }) => {
    const id = ulid();
    produce(id, input);

    return {
      id,
    };
  }),
});
