import { writeFile } from "node:fs/promises";
import { z } from "zod";
import { Line, type Script } from "./ai.js";

export type PostLine = z.infer<typeof PostLine>;
export const PostLine = Line.and(
  z.object({
    time: z.number(),
    face: z.number().optional(),
  })
);

export async function meta(
  kind: "ai" | "custom",
  script: Script["lines"],
  times: number[]
) {
  const metadata = {
    kind,
    date: new Date().toISOString(),
    script: script.map((line, i): PostLine => {
      if (line.kind === "narrator")
        return {
          ...line,
          time: times[i],
        };

      return {
        ...line,
        face: (Math.random() < 0.5 ? 2 : 1) as 1 | 2 | 3,
        time: times[i],
      };
    }),
    output: {
      audio: "out/output.mp3",
      video: "out/output.mp4",
    },
  };

  await writeFile(
    "out/script.txt",
    script
      .map((line) =>
        line.kind === "narrator"
          ? `(${line.text})`
          : `${line.name}: ${line.content}`
      )
      .join("\n")
  );

  await writeFile("out/metadata.json", JSON.stringify(metadata, null, 2));

  return metadata;
}
