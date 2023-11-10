import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export function withOutDir(path: string) {
  return resolve(__dirname, "./out", path);
}
