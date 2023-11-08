import { z } from "zod";
import { memory } from "./memory.js";

export type Production = z.infer<typeof Production>;
export const Production = z.object({
  id: z.string(),
  createdAt: z.string(),
  video: z.discriminatedUnion("status", [
    z.object({ status: z.literal("writing") }),
    z.object({ status: z.literal("acting") }),
    z.object({ status: z.literal("editing") }),
    z.object({ status: z.literal("error"), reason: z.string() }),
    z.object({ status: z.literal("done"), uri: z.string() }),
  ]),
});

export const productions = memory(Production);
