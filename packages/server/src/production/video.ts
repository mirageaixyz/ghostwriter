import { secondsFrom, type produce as takeCut } from "@ghostwriter/actor";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { enableTailwind } from "@remotion/tailwind";
import consola from "consola";
import { copyFile } from "node:fs/promises";

export async function fixInPost(
  metadata: NonNullable<Awaited<ReturnType<typeof takeCut>>>,
  outputLocation: string
) {
  const start = Date.now();

  consola.start("Copying files...");
  await copyFile("./out/output.mp4", "../video/public/out/output.mp4");
  consola.success(`Copied files! (Took ${secondsFrom(start)}s)`);

  const startBundle = Date.now();
  consola.start("Bundling blueprint...");
  const bundled = await bundle({
    entryPoint: "../video/src/index.ts",
    webpackOverride: (currentConfiguration) =>
      enableTailwind(currentConfiguration),
  });
  consola.success(`Bundled blueprint! (Took ${secondsFrom(startBundle)}s)`);

  const inputProps = {
    script: metadata.script,
  };

  const startRender = Date.now();

  consola.start("Editing video using blueprint...");
  const composition = await selectComposition({
    serveUrl: bundled,
    id: "presidents",
    inputProps,
  });

  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation,
    inputProps,
    chromiumOptions: {
      enableMultiProcessOnLinux: true,
      headless: true,
    },
  });

  consola.success(
    `Edited video using blueprint! (Took ${secondsFrom(startRender)}s)`
  );
  consola.info(`All process in total took ${secondsFrom(start)}s`);
}
