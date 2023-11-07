import { Line } from "@ghostwriter/actor";
import { z } from "zod";
import { memory } from "./memory.js";

export type Content = z.infer<typeof Content>;
export const Content = z.object({
  id: z.string(),
  createdAt: z.string().datetime(),
  video: z.discriminatedUnion("status", [
    z.object({ status: z.literal("pending") }),
    z.object({ status: z.literal("failed"), reason: z.string() }),
    z.object({
      status: z.literal("done"),
      uri: z.string(),
      script: Line.array(),
    }),
    z.object({ status: z.literal("stale"), script: Line.array() }),
  ]),
  kind: z.literal("ai").or(z.literal("custom")),
});

export const content = memory(Content);
