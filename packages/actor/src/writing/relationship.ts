import { z } from "zod";

export type Relationship = z.infer<typeof Relationship>;
export const Relationship = z.object({
  personas: z.string().array(),
  description: z.string(),
});
