import { z } from "zod";

export type Env = z.infer<typeof Env>;
export const Env = z.object({
  OPENAI_KEY: z.string(),
  ELEVENLABS_KEY: z.string(),
  VOICE_TRUMP: z.string(),
  VOICE_BIDEN: z.string(),
  VOICE_OBAMA: z.string(),
  OPTION: z.optional(z.union([z.literal("ai"), z.literal("custom")])),
  TOPIC: z.optional(z.string()),
});

export const env = Env.parse(process.env);

export async function input<T>(args: {
  fn: () => T;
  or: (env: Env) => Awaited<T> | undefined;
}) {
  const curr = args.or(env);
  if (curr) return curr;
  const res = await args.fn();
  return res;
}
