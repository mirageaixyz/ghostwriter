import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { Context } from "./context.js";
import { Metadata, content } from "./data/content.js";
import { nid } from "./data/memory.js";
import { produce } from "./production/index.js";

export const t = initTRPC.context<Context>().create();

export const router = t.router({
  vibecheck: t.procedure.query(() => "Hello"),

  getContent: t.procedure
    .input(z.string())
    .query(({ input }) => content.get(input) ?? null),

  createContent: t.procedure.input(Metadata).mutation(async ({ input }) => {
    const id = nid();
    produce(id, input);

    return {
      id,
      uri: `/out/${id}.mp4`,
    };
  }),
});
