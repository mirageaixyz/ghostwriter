import { content } from "../data/content.js";
import { takeCut } from "./actor.js";
import { fixInPost } from "./video.js";

export async function produce(
  id: string,
  input: Parameters<typeof takeCut>[0]
) {
  const uri = `/out/${id}.mp4`;
  const date = new Date();

  content.set(id, {
    id,
    createdAt: date.toISOString(),
    video: {
      status: "pending",
    },
  });

  const metadata = await takeCut(input);

  if (!metadata) {
    console.log("Production failed");
    return;
  }

  await fixInPost(metadata, `./out/${id}.mp4`);

  content.set(id, {
    id,
    createdAt: date.toISOString(),
    video: {
      status: "done",
      uri,
    },
  });
}
