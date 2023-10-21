import { z } from "zod";
import { memory } from "./memory.js";

export type Script = z.infer<typeof Script>;
export const Script = z.array(
  z.object({
    name: z.string(),
    content: z.string(),
  })
);

export type Metadata = z.infer<typeof Metadata>;
export const Metadata = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("ai"), topic: z.string() }),
  z.object({
    kind: z.literal("custom"),
    script: Script,
  }),
]);

export type Content = z.infer<typeof Content>;
export const Content = z.object({
  id: z.string(),
  createdAt: z.string().datetime(),
  video: z.discriminatedUnion("status", [
    z.object({ status: z.literal("pending") }),
    z.object({ status: z.literal("failed"), reason: z.string() }),
    z.object({ status: z.literal("done"), uri: z.string(), script: Script }),
    z.object({ status: z.literal("stale"), script: Script }),
  ]),
  kind: z.literal("ai").or(z.literal("custom")),
});

export const content = memory(Content);
