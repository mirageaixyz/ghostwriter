import { z } from "zod";
import { memory } from "./memory.js";

export type Content = z.infer<typeof Content>;
export const Content = z.object({
  id: z.string(),
  video: z.discriminatedUnion("status", [
    z.object({ status: z.literal("pending") }),
    z.object({ status: z.literal("done"), uri: z.string() }),
  ]),
});

export const content = memory(Content);
