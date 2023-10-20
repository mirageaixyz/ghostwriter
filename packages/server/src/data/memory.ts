import type { z } from "zod";
export function memory<T extends z.ZodTypeAny>(schema: T) {
  const cache = new Map<string, z.infer<T>>();

  return {
    all: () => [...cache.values()],
    get: (id: string) => cache.get(id),
    set: (id: string, value: z.infer<T>) => {
      cache.set(id, value);
    },
    delete: (id: string) => {
      cache.delete(id);
    },
  };
}

export function nid() {
  return Date.now().toString();
}
