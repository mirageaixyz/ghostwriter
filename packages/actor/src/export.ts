import consola from "consola";
import { mkdir } from "node:fs/promises";
import { direct } from "./video/direct.js";
import { audiofile, composeVoices, voiceAct } from "./voiceacting/ai.js";
import { Option, script } from "./writing/ai.js";
import { meta } from "./writing/script.js";

export function secondsFrom(time: number) {
  return Math.round(((Date.now() - time) / 1000) * 100) / 100;
}

type Callbacks = {
  onWriteFinish?: () => void;
  onRecordFinish?: () => void;
};

export async function produce(
  option: Option,
  { onWriteFinish, onRecordFinish }: Callbacks = {}
) {
  const start = Date.now();
  consola.start(`Generating script...`);

  await mkdir("out", { recursive: true });

  const draft = await script(option);

  consola.success(`Generated script! (Took ${secondsFrom(start)}s)`);

  const startVoice = Date.now();
  consola.start("Generating voices...");

  onWriteFinish?.();

  const times = [];

  for (let i = 0; i < draft.lines.length; i++) {
    const line = draft.lines[i];
    const name = line.kind === "narrator" ? line.kind : line.name;
    const content = line.kind === "narrator" ? line.text : line.content;
    const res = await voiceAct(name, content, audiofile(i));
    if (res.status != "ok") {
      consola.error(`Failed to generate voice for ${name}`);
      return;
    }
    times.push(res.time);
  }
  consola.success(`Generated voices! (Took ${secondsFrom(startVoice)}s)`);

  onRecordFinish?.();

  const metadata = await meta(option.kind, draft.lines, times);

  const startCombining = Date.now();
  consola.start("Combining voices...");

  await composeVoices(draft.lines);

  consola.success(`Combined voices! (Took ${secondsFrom(startCombining)}s)`);

  const startVideo = Date.now();
  consola.start("Generating base video...");

  await direct();

  consola.success(`Generated base video! (Took ${secondsFrom(startVideo)}s)`);
  consola.info(`Script, voices, and base video in ${secondsFrom(start)}s`);

  return metadata;
}

export { withOutDir } from "./lib/files.js";
export { Voice } from "./voiceacting/voice.js";
export { Line, Option, Script } from "./writing/ai.js";
export { Persona } from "./writing/persona.js";
export { Relationship } from "./writing/relationship.js";
export { PostLine } from "./writing/script.js";
