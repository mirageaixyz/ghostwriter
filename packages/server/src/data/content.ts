import { z } from "zod";
import { memory } from "./memory.js";

export type Metadata = z.infer<typeof Metadata>;
export const Metadata = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("ai"), topic: z.string() }),
  z.object({
    kind: z.literal("custom"),
    script: z.array(z.object({ name: z.string(), content: z.string() })),
  }),
]);

export type Content = z.infer<typeof Content>;
export const Content = z.object({
  id: z.string(),
  createdAt: z.string().datetime(),
  video: z.discriminatedUnion("status", [
    z.object({ status: z.literal("pending") }),
    z.object({ status: z.literal("done"), uri: z.string() }),
  ]),
});

export const content = memory(Content);
