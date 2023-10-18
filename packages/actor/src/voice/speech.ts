import audioconcat from "audioconcat";
import consola from "consola";
import speech from "elevenlabs-node";
import ffmpeg from "fluent-ffmpeg";
import { unlink } from "node:fs/promises";
import { env } from "../env.js";
import { voiceInfo } from "./id.js";

export async function voice(name: string, content: string, filename: string) {
  const { id, volume } = voiceInfo(name);
  const res = await speech.textToSpeech(
    env.ELEVENLABS_KEY,
    id,
    volume !== 1 ? "temp-unboosted.mp3" : filename,
    content,
    0.5,
    0.5
  );
  if (res.status != "ok") {
    consola.error(`Got an error ${JSON.stringify(res)}`);
    return { status: "error", time: 0 };
  }

  if (volume !== 1) {
    await new Promise<void>((resolve) =>
      ffmpeg("temp-unboosted.mp3")
        .audioFilter(`volume=${volume}`)
        .on("end", () => resolve())
        .save(filename)
    );
    await unlink("temp-unboosted.mp3");
  }

  const time = await new Promise<number>((resolve) =>
    ffmpeg.ffprobe(filename, (_, { format }) => {
      resolve(format.duration ?? 0);
    })
  );

  return { status: res.status as "ok" | "error", time };
}

export async function combineVoices(
  script: { name: string; content: string }[]
) {
  const names = script.map((_, i) => `out/temp-${i}.mp3`);
  await new Promise<void>((resolve) =>
    audioconcat(names)
      .concat("out/output.mp3")
      .on("end", () => resolve())
  );

  await Promise.all(names.map((name) => unlink(name)));
}
