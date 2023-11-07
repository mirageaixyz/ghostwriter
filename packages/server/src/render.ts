import type { Line } from "@ghostwriter/actor";
import consola from "consola";
import { produce } from "./production/index.js";

const kind = await consola.prompt(
  "What kind of video do you want to make? (ai/custom) (default: ai) ",
  {
    type: "select",
    options: ["ai" as const, "custom" as const],
  }
);

if (kind === "ai") {
  const topic = await consola.prompt(
    "What topic do you want to make a video about? (default: cats) ",
    {
      type: "text",
    }
  );

  await produce("result", {
    kind,
    idea: topic || "cats",
  });
} else {
  const lines = [] as Line[];
  while (true) {
    const person = await consola.prompt(
      "Who do you want to speak? (or stop to end) ",
      {
        type: "select",
        options: [
          "Donald Trump" as const,
          "Joe Biden" as const,
          "Barack Obama" as const,
          "stop" as const,
        ],
      }
    );
    if (person === "stop") {
      break;
    }
    const content = await consola.prompt("What do you want them to say? ", {
      type: "text",
    });

    lines.push({ kind: "spoken" as const, name: person, content });
  }

  await produce("result", {
    kind,
    script: { lines },
  });
}
