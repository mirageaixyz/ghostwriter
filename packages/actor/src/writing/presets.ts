import { personas, type Persona } from "./persona.js";
import { type Relationship } from "./relationship.js";

export type Preset = {
  personas: Persona[];
  relationships: Relationship[];
};

export const presets = {
  presidents: {
    personas: [personas.biden, personas.obama, personas.trump],
    relationships: [
      {
        personas: [
          personas.biden.name,
          personas.obama.name,
          personas.trump.name,
        ],
        description:
          "All presidents must insults and say banters with deep meaning usually rude and insulting during the conversation",
      },
      {
        personas: [personas.biden.name, personas.trump.name],
        description:
          "Donald should call Joe as Sleepy Joe and insult him for being an old man",
      },
      {
        personas: [personas.biden.name, personas.trump.name],
        description: "Joe should call Donald as Donny or Trumpy",
      },
      {
        personas: [personas.biden.name, personas.obama.name],
        description: "Joe should call Barack as Obamna",
      },
      {
        personas: [personas.biden.name],
        description: "Joe should be called out for touching kids",
      },
      {
        personas: [
          personas.biden.name,
          personas.trump.name,
          personas.obama.name,
        ],
        description: "Joe should be insulted for doing a poor job as president",
      },
      {
        personas: [personas.obama.name, personas.trump.name],
        description:
          "Donald would often disagree with Obama for the sake of disagreeing",
      },
      {
        personas: [personas.obama.name, personas.trump.name],
        description:
          "Donald often like to say to Barack that he was not born in the US",
      },
      {
        personas: [
          personas.obama.name,
          personas.trump.name,
          personas.biden.name,
        ],
        description: "Barack should be called out for his drone strikes",
      },
      {
        personas: [
          personas.obama.name,
          personas.trump.name,
          personas.biden.name,
        ],
        description:
          "Donald should be called out for him trying to build a wall",
      },
    ],
  },
} satisfies Record<string, Preset>;
