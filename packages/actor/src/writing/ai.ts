import consola from "consola";
import OpenAI from "openai";
import { z } from "zod";
import { env } from "../env.js";
import { createContext } from "./context.js";
import { presets, type Preset } from "./presets.js";

const ai = new OpenAI({
  apiKey: env.OPENAI_KEY,
});

export type Line = z.infer<typeof Line>;
export const Line = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("narrator"),
    text: z.string(),
  }),
  z.object({
    kind: z.literal("spoken"),
    name: z.string(),
    content: z.string(),
    emotion: z.enum(["calm", "angry", "laugh", "sad", "happy", "surprised"]),
  }),
]);

export type Script = z.infer<typeof Script>;
export const Script = z.object({
  lines: Line.array(),
});

export type Option = z.infer<typeof Option>;
export const Option = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("ai"), idea: z.string() }),
  z.object({ kind: z.literal("custom"), script: Script }),
]);

export async function generateScript(
  idea: string,
  preset: Preset = presets.presidents
) {
  return await ai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: createContext(preset),
      },
      {
        role: "user",
        content: JSON.stringify({ idea }),
      },
    ],
    max_tokens: 1000,
    model: "gpt-3.5-turbo",
  });
}

export async function script(
  option: Option,
  preset: Preset = presets.presidents
) {
  if (option.kind === "custom") {
    return option.script;
  }

  const res = await generateScript(option.idea, preset);

  const {
    message: { content },
  } = res.choices.filter(({ message }) => message.role === "assistant")[0];

  if (!content) {
    throw new Error("Cannot create script, try again later!");
  }

  const raw = JSON.parse(content);
  const maybeScript = await Script.safeParseAsync(raw);
  if (!maybeScript.success) {
    consola.error(raw);
    throw new Error("Yea, something went wrong in the writing department :(");
  }
  const script = maybeScript.data;
  return {
    ...script,
    lines: script.lines.map((line) =>
      line.kind === "narrator"
        ? line
        : {
            ...line,
            content: line.content
              .replace("fudge", "fuck")
              .replace("fudging", "fucking")
              .replace("Fudge", "Fuck")
              .replace("Fudging", "Fucking")
              .replace("sheet", "shit")
              .replace("sheeting", "shitting")
              .replace("Sheet", "Shit")
              .replace("Sheeting", "Shitting"),
          }
    ),
  };
}
