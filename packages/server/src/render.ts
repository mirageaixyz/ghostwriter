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

  await produce({
    kind,
    topic: topic || "cats",
  });
} else {
  const script = [] as { name: string; content: string }[];
  while (true) {
    const person = await consola.prompt(
      "Who do you want to speak? (or stop to end) ",
      {
        type: "select",
        options: [
          "Donald Trump" as const,
          "Joe Biden" as const,
          "Obama" as const,
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
    script.push({ name: person, content });
  }

  await produce({
    kind,
    script,
  });
}
