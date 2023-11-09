import { z } from "zod";

export type Env = z.infer<typeof Env>;
export const Env = z.object({
  OPENAI_KEY: z.string(),
  ELEVENLABS_KEY: z.string(),
  VOICE_TRUMP: z.string(),
  VOICE_BIDEN: z.string(),
  VOICE_OBAMA: z.string(),
});

export const env = Env.parse(process.env);
