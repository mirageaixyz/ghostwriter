import { join } from "node:path";
export function withOutDir(path: string) {
  return join("./out", path);
}
