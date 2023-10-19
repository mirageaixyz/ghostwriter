import { takeCut } from "./actor.js";
import { fixInPost } from "./video.js";

export async function produce(input: Parameters<typeof takeCut>[0]) {
  const metadata = await takeCut(input);

  if (!metadata) {
    console.log("Production failed");
    return;
  }

  await fixInPost(metadata, "./out/result.mp4");
}
