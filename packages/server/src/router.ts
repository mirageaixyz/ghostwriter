import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { Context } from "./context.js";
import { Metadata, content } from "./data/content.js";
import { nid } from "./data/memory.js";
import { produce } from "./production/index.js";

export const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  hello: t.procedure.query(() => "Hello"),

  status: t.procedure
    .input(z.string())
    .query(({ input }) => content.get(input) ?? null),

  content: t.procedure.input(Metadata).mutation(async ({ input }) => {
    const id = nid();
    produce(id, input);

    return {
      uri: `/out/${id}.mp4`,
    };
  }),
});
