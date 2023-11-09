import { z } from "zod";

export type Env = z.infer<typeof Env>;
export const Env = z.object({
  NODE_ENV: z
    .enum(["production", "development", "testing"])
    .catch("development")
    .transform((val) => (val === "production" ? "PROD" : "DEV")),
  OPENAI_KEY: z.string(),
  ELEVENLABS_KEY: z.string(),
  VOICE_TRUMP: z.string(),
  VOICE_BIDEN: z.string(),
  VOICE_OBAMA: z.string(),
  NEON_DATABASE_URL: z.string(),
  UPSTASH_REDIS_REST_URL: z.string(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
});

export const env = Env.parse(process.env);
