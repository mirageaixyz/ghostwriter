import consola from "consola";
import { mkdir } from "node:fs/promises";
import { meta, script } from "./script/writer.js";
import { direct } from "./video/record.js";
import { combineVoices, voice } from "./voice/speech.js";

export function secondsFrom(time: number) {
  return Math.round(((Date.now() - time) / 1000) * 100) / 100;
}

export async function produce(...args: Parameters<typeof script>) {
  const start = Date.now();
  consola.start(`Generating script...`);

  await mkdir("out", { recursive: true });

  const draft = await script(...args);

  consola.success(`Generated script! (Took ${secondsFrom(start)}s)`);

  const startVoice = Date.now();
  consola.start("Generating voices...");

  const times = [];

  for (const i in draft) {
    const { name, content } = draft[i];
    const res = await voice(name, content, `out/temp-${i}.mp3`);
    if (res.status != "ok") {
      consola.error(`Failed to generate voice for ${name}`);
      return;
    }
    times.push(res.time);
  }
  consola.success(`Generated voices! (Took ${secondsFrom(startVoice)}s)`);

  const metadata = await meta(args[0].kind, draft, times);

  const startCombining = Date.now();
  consola.start("Combining voices...");

  await combineVoices(draft);

  consola.success(`Combined voices! (Took ${secondsFrom(startCombining)}s)`);

  const startVideo = Date.now();
  consola.start("Generating base video...");

  await direct();

  consola.success(`Generated base video! (Took ${secondsFrom(startVideo)}s)`);
  consola.info(`Script, voices, and base video in ${secondsFrom(start)}s`);

  return metadata;
}
