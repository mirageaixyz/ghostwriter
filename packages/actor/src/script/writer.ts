import consola from "consola";
import { readFile, writeFile } from "node:fs/promises";
import { input } from "../env.js";
import { generateScript } from "./ai.js";

export type Script = {
  name: string;
  content: string;
}[];

export type Option =
  | { kind: "ai"; topic: string }
  | { kind: "custom"; script: Script };

export async function script(option: Option) {
  if (option.kind === "custom") {
    return option.script;
  }

  const raw = await generateScript(option.topic);
  return raw.choices.map(({ message }) =>
    parseScript(message.content ?? "")
  )[0];
}

export async function meta(
  kind: "ai" | "custom",
  script: ReturnType<typeof parseScript>,
  times: number[]
) {
  const metadata = {
    kind,
    date: new Date().toISOString(),
    script: script.map(({ name, content }, i) => ({
      name,
      content,
      audio: `out/temp-${i}.mp3`,
      face: (Math.random() < 0.5 ? 2 : 1) as 1 | 2 | 3,
      time: times[i],
    })),
    output: {
      audio: "out/output.mp3",
      video: "out/output.mp4",
    },
  };

  await writeFile(
    "out/script.txt",
    script.map(({ name, content }) => `${name}: ${content}`).join("\n")
  );

  await writeFile("out/metadata.json", JSON.stringify(metadata, null, 2));

  return metadata;
}

export async function writeScript(kind: "custom" | "ai") {
  if (kind === "custom") {
    const res = await readFile("./custom.txt");
    const script = res.toString();
    return parseScript(script);
  }

  const topic = await input({
    fn: () =>
      consola.prompt("What is the topic of the video?", {
        type: "text",
      }),
    or: (e) => e.TOPIC,
  });

  const res = await generateScript(topic);
  return res.choices.map(({ message }) =>
    parseScript(message.content ?? "")
  )[0];
}

function parseScript(script: string) {
  const lines = script.split("\n");
  const res = lines
    .filter((line) => line.includes(":"))
    .map((line) => {
      const [name, content] = line.split(":");
      return {
        name,
        content: content.includes('"')
          ? content.slice(1, content.length - 1)
          : content,
      };
    })
    .map(({ name, content }) => ({
      name,
      content: content
        .replace("fudge", "fuck")
        .replace("fudging", "fucking")
        .replace("Fudge", "Fuck")
        .replace("Fudging", "Fucking")
        .replace("shoot", "shit")
        .replace("shooting", "shitting")
        .replace("Shoot", "Shit")
        .replace("Shooting", "Shitting"),
    }));
  return res;
}
