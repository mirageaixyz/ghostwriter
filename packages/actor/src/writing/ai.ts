import OpenAI from "openai";
import { z } from "zod";
import { env } from "../env.js";
import { createContext } from "./context.js";
import { presets, type Preset } from "./presets.js";

const ai = new OpenAI({
  apiKey: env.OPENAI_KEY,
});

export type Emotion = z.infer<typeof Emotion>;
export const Emotion = z
  .enum(["calm", "angry", "laugh", "sad", "happy", "surprised"])
  .catch("calm");

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
  z.object({ kind: z.literal("ai"), topic: z.string() }),
  z.object({ kind: z.literal("custom"), script: Script }),
]);

export async function generateScript(
  topic: string,
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
        content: JSON.stringify({ topic }),
      },
    ],
    max_tokens: 2100,
    temperature: 1,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    model: "gpt-3.5-turbo",
  });
}

export async function script(
  option: Option,
  preset: Preset = presets.presidents
): Promise<Script> {
  if (option.kind === "custom") {
    return option.script;
  }

  const res = await generateScript(option.topic, preset);

  const current = { lines: [] } as Script;
  for (const {
    message: { content, role },
  } of res.choices) {
    if (!content || role !== "assistant") {
      throw new Error("Input malfunction :(");
    }

    const lines = content
      .split("\n")
      .map((each) => each.trim())
      .filter((each) => each.length > 0);
    for (const line of lines) {
      const kind =
        line.includes("Narrator") || line.includes("narrator")
          ? "narrator"
          : line.includes("|")
          ? "spoken"
          : undefined;

      const [name, words, emotion] = line.split("|");

      switch (kind) {
        case "spoken": {
          current.lines.push({
            kind: "spoken",
            name,
            content: words,
            emotion: Emotion.parse(emotion),
          });
          break;
        }
        case "narrator": {
          current.lines.push({
            kind: "narrator",
            text: words,
          });
          break;
        }
        default:
          break;
      }
    }
  }

  if (!current.lines || !current.lines.length) {
    throw new Error("Yea, something went wrong in the writing department :(");
  }

  return {
    ...current,
    lines: current.lines.map((line) =>
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
