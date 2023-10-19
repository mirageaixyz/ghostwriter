import { initTRPC } from "@trpc/server";
import workerpool from "workerpool";
import { z } from "zod";
import { Context } from "./context.js";
import { produce } from "./production/index.js";

const pool = workerpool.pool();

export const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  hello: t.procedure.query(() => "Hello"),

  content: t.procedure
    .input(
      z.discriminatedUnion("kind", [
        z.object({ kind: z.literal("ai"), topic: z.string() }),
        z.object({
          kind: z.literal("custom"),
          script: z.array(z.object({ name: z.string(), content: z.string() })),
        }),
      ])
    )
    .mutation(async ({ input }) => {
      produce(input);

      return {
        uri: `/video.mp4`,
      };
    }),
});
