import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const currentFile = fileURLToPath(import.meta.url);
export const currentDir = resolve(dirname(currentFile), "../");
