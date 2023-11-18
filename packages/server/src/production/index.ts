import consola from "consola";
import { resolve } from "node:path";
import { productions } from "../data/content.js";
import { currentDir } from "../lib/files.js";
import { takeCut } from "./actor.js";
import { fixInPost } from "./video.js";

export async function produce(
  id: string,
  userId: string,
  input: Parameters<typeof takeCut>[0]
) {
  const uri = `/out/${id}.mp4`;
  const createdAt = new Date().toISOString();

  productions.set(id, {
    id,
    createdAt,
    video: {
      status: "writing",
    },
    userId,
  });

  try {
    const result = await takeCut(input, {
      onWriteFinish() {
        productions.set(id, {
          id,
          createdAt,
          video: {
            status: "acting",
          },
          userId,
        });
      },
    });

    if (!result) {
      consola.error("Production failed");
      productions.set(id, {
        id,
        createdAt,
        video: {
          status: "error",
          reason: "Failed to record lines or write script",
        },
        userId,
      });

      return;
    }

    productions.set(id, {
      id,
      createdAt,
      video: {
        status: "editing",
      },
      userId,
    });

    await fixInPost(result, resolve(currentDir, `./out/${id}.mp4`));
    productions.set(id, {
      id,
      createdAt,
      video: {
        status: "done",
        uri,
      },
      userId,
    });
  } catch (e) {
    consola.error(e);
    productions.set(id, {
      id,
      createdAt,
      video: {
        status: "error",
        reason: `${e}`,
      },
      userId,
    });
  } finally {
    await new Promise<undefined>((resolve) =>
      setTimeout(() => {
        productions.ee.emit(`status:${id}:close`, null);
        resolve(undefined);
      }, 400)
    );
  }
}
