import ffmpeg from "fluent-ffmpeg";
import { resolve as pathResolve } from "node:path";
import { __dirname, withOutDir } from "../lib/files.js";

export async function direct() {
  const duration = await new Promise<number>((resolve) =>
    ffmpeg.ffprobe(withOutDir("./output.mp3"), (_, { format }) => {
      resolve(format.duration ?? 0);
    })
  );

  await new Promise<void>((resolve) =>
    ffmpeg()
      .input(pathResolve(__dirname, "../../video.mp4"))
      .input(withOutDir("./output.mp3"))
      .outputOptions([
        "-c:v copy",
        "-c:a aac",
        "-map 0:v:0",
        "-map 1:a:0",
        `-t ${duration}`,
      ])
      .on("end", () => resolve())
      .save(withOutDir("./output.mp4"))
  );
}
