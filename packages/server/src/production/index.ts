import { __dirname, withOutDir } from "@ghostwriter/actor";
import consola from "consola";
import { productions } from "../data/content.js";
import { takeCut } from "./actor.js";
import { fixInPost } from "./video.js";

export async function produce(
  id: string,
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
  });

  consola.debug(
    `Path is starting at ${__dirname} and out is at ${withOutDir("./")}}`
  );

  try {
    const metadata = await takeCut(input, {
      onWriteFinish() {
        productions.set(id, {
          id,
          createdAt,
          video: {
            status: "acting",
          },
        });
      },
    });

    if (!metadata) {
      consola.error("Production failed");
      productions.set(id, {
        id,
        createdAt,
        video: {
          status: "error",
          reason: "Failed to record lines or write script",
        },
      });

      return;
    }

    productions.set(id, {
      id,
      createdAt,
      video: {
        status: "editing",
      },
    });

    await fixInPost(metadata, withOutDir(`./${id}.mp4`));
    productions.set(id, {
      id,
      createdAt,
      video: {
        status: "done",
        uri,
      },
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
    });
  }
}
