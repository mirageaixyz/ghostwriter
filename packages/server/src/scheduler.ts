import consola from "consola";
import cron from "node-cron";
import { unlink } from "node:fs/promises";
import { content } from "./data/content.js";

cron.schedule("0 0 * * *", async () => {
  const videos = content.all();

  consola.info(`Deleting ${videos.length} videos`);

  for (const video of videos) {
    const path = `./out/${video.id}.mp4`;
    const date = new Date(video.createdAt);
    if (
      video.video.status === "done" &&
      date.getTime() < Date.now() - 1000 * 60 * 60 * 24 * 2
    ) {
      await unlink(path);
      content.set(video.id, {
        ...video,
        video: {
          ...video.video,
          status: "stale",
        },
      });
    }
  }
});
