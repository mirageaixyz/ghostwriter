import * as v from "valibot";

export type Env = v.Output<typeof Env>;
export const Env = v.object({
  OPENAI_KEY: v.string(),
  ELEVENLABS_KEY: v.string(),
  VOICE_TRUMP: v.string(),
  VOICE_BIDEN: v.string(),
  VOICE_OBAMA: v.string(),
  OPTION: v.optional(v.union([v.literal("ai"), v.literal("custom")])),
  TOPIC: v.optional(v.string()),
});

export const env = v.parse(Env, process.env);

export async function input<T>(args: {
  fn: () => T;
  or: (env: Env) => Awaited<T> | undefined;
}) {
  const curr = args.or(env);
  if (curr) return curr;
  const res = await args.fn();
  return res;
}
