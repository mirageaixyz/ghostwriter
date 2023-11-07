import ffmpeg from "fluent-ffmpeg";

export async function direct() {
  const duration = await new Promise<number>((resolve) =>
    ffmpeg.ffprobe("out/output.mp3", (_, { format }) => {
      resolve(format.duration ?? 0);
    })
  );

  await new Promise<void>((resolve) =>
    ffmpeg()
      .input("../../video.mp4")
      .input("out/output.mp3")
      .outputOptions([
        "-c:v copy",
        "-c:a aac",
        "-map 0:v:0",
        "-map 1:a:0",
        `-t ${duration}`,
      ])
      .on("end", () => resolve())
      .save("out/output.mp4")
  );
}
