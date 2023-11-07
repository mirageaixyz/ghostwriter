import { z } from "zod";
import { env } from "../env.js";
import { personas } from "../writing/persona.js";

export type Modification = z.infer<typeof Modification>;
export const Modification = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("volume"),
    percentage: z.number().positive().min(0),
  }),
]);

export type Voice = z.infer<typeof Voice>;
export const Voice = z.object({
  id: z.string(),
  name: z.string(),
  modifications: Modification.array(),
});

export const voices = {
  biden: {
    name: personas.biden.name,
    id: env.VOICE_BIDEN,
    modifications: [
      {
        kind: "volume",
        percentage: 2,
      },
    ],
  },
  trump: {
    name: personas.trump.name,
    id: env.VOICE_TRUMP,
    modifications: [
      {
        kind: "volume",
        percentage: 2.125,
      },
    ],
  },
  obama: {
    name: personas.obama.name,
    id: env.VOICE_OBAMA,
    modifications: [
      {
        kind: "volume",
        percentage: 2.125,
      },
    ],
  },
} satisfies Record<string, Voice>;

export function findVoice(name: string) {
  if (name === "narrator") return voices.biden;
  const definedVoices = Object.values(voices);
  const matches = definedVoices.filter((v) => v.name === name);
  return matches.at(0);
}
