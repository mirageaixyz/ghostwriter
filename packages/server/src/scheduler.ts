import consola from "consola";
import cron from "node-cron";
import { unlink } from "node:fs/promises";
import { content } from "./data/content.js";

cron.schedule("* * */2 * *", async () => {
  const videos = content.all();

  consola.info(`Deleting ${videos.length} videos`);

  for (const video of videos) {
    if (video.video.status === "done") {
      await unlink(`./out/${video.id}.mp4`);
      content.delete(video.id);
    }
  }
});
