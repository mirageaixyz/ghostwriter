import audioconcat from "audioconcat";
import consola from "consola";
import speech from "elevenlabs-node";
import ffmpeg from "fluent-ffmpeg";
import { unlink } from "node:fs/promises";
import { env } from "../env.js";
import { Script } from "../writing/ai.js";
import { findVoice } from "./voice.js";

export function audiofile(index: number) {
  return `out/audio-line-${index}.mp3`;
}

export async function voiceAct(
  name: string,
  content: string,
  filename: string
) {
  const voice = findVoice(name);
  if (!voice) {
    throw new Error(`No voice for ${name}`);
  }
  const { id, modifications } = voice;
  const res = await speech.textToSpeech(
    env.ELEVENLABS_KEY,
    id,
    modifications.length > 0 ? "out/need-audio-tuning-0.mp3" : filename,
    content,
    0.5,
    0.5
  );

  if (res.status != "ok") {
    consola.error(`Got an error ${JSON.stringify(res)}`);
    return { status: "error", time: 0 };
  }

  if (modifications.length > 0) {
    for (let i = 0; i < modifications.length; i++) {
      const modification = modifications[i];
      const curr = `out/need-audio-tuning-${i}.mp3`;
      const next =
        i === modifications.length - 1
          ? filename
          : `out/need-audio-tuning-${i + 1}.mp3`;

      await new Promise<void>((resolve) =>
        ffmpeg(curr)
          .audioFilter(`${modification.kind}=${modification.percentage}`)
          .on("end", () => resolve())
          .save(next)
      );
      await unlink(curr);
    }
  }

  const time = await new Promise<number>((resolve) =>
    ffmpeg.ffprobe(filename, (_, { format }) => {
      resolve(format.duration ?? 0);
    })
  );

  return { status: res.status as "ok" | "error", time };
}

export async function composeVoices(script: Script["lines"]) {
  const names = script.map((_, i) => audiofile(i));
  await new Promise<void>((resolve) =>
    audioconcat(names)
      .concat("out/output.mp3")
      .on("end", () => resolve())
  );
  await Promise.all(names.map((name) => unlink(name)));
}
