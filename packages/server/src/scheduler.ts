import consola from "consola";
import cron from "node-cron";
import { unlink } from "node:fs/promises";
import { content } from "./data/content.js";

cron.schedule("0 0 * * *", async () => {
  const videos = content.all();

  consola.info(`Deleting ${videos.length} videos`);

  for (const video of videos) {
    const isDone = video.video.status === "done";
    const path = `./out/${video.id}.mp4`;
    const date = new Date(video.createdAt);
    if (isDone && date.getTime() < Date.now() - 1000 * 60 * 60 * 24 * 2) {
      await unlink(path);
      content.delete(video.id);
    }
  }
});
