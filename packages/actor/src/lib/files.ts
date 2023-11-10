import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const currentFile = fileURLToPath(import.meta.url);
export const actorDir = resolve(dirname(currentFile), "../");

export function withOutDir(path: string) {
  return resolve(actorDir, "./out", path);
}
