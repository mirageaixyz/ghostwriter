import { resolve } from "node:path";
export function withOutDir(path: string) {
  return resolve(__dirname, "./out", path);
}
