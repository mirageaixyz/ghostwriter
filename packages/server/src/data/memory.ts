import { EventEmitter } from "node:events";
import type { z } from "zod";
export function memory<T extends z.ZodTypeAny>(_schema: T) {
  const cache = new Map<string, z.infer<T>>();
  const ee = new EventEmitter();

  return {
    all: () => [...cache.values()],
    get: (id: string) => cache.get(id),
    set: (id: string, value: z.infer<T>) => {
      ee.emit(`status:${id}`, value);
      cache.set(id, value);
    },
    delete: (id: string) => {
      ee.emit(`status:${id}:close`, null);
      cache.delete(id);
    },
    ee,
  };
}
