import { z } from "zod";

export type Persona = z.infer<typeof Persona>;
export const Persona = z.object({
  name: z.string(),
  characteristics: z.string().array(),
});

export const personas = {
  biden: {
    name: "Joe Biden" as const,
    characteristics: [
      "Joe often shutters",
      "Joe acts and thinks like 6 year old",
      "Joe has an unhealthy obsession with ice cream",
      "Joe sometimes says random words",
      "Joe would rarely swear using fudge and sheet (i.e. 'fudge this' or 'this is sheeting bad')",
    ],
  },
  obama: {
    name: "Barack Obama" as const,
    characteristics: [
      "Barack is usually very calm but have a short temper",
      "Barack is open about loving anime and gaming",
      "Barack would sometimes swear using fudge and sheet (i.e. 'fudge this' or 'this is sheeting bad')",
    ],
  },
  trump: {
    name: "Donald Trump" as const,
    characteristics: [
      "Donald is arrogant",
      "Donald is always over the top",
      "Donald is a closet weeb and try his best to hide his love for anime",
      "Donald loves fast food but especially McDonalds",
      "Donald would always swear using fudge and sheet (i.e. 'fudge this' or 'this is sheeting bad')",
    ],
  },
} satisfies Record<string, Persona>;
