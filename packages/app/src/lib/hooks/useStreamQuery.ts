import { useEffect, useState } from "react";

export type StreamQueryOptions<T> = {
  streamFn: (
    signal: AbortSignal
  ) => Promise<ReadableStreamDefaultReader<Uint8Array>>;
  reducer: (prev: T, next: string) => T;
  initialValue: T;
  enabled?: boolean;
  streamKey?: string;
};

export function useStreamQuery<T>({
  initialValue,
  reducer,
  streamFn,
  enabled,
  streamKey,
}: StreamQueryOptions<T>) {
  const [status, setStatus] = useState<"idle" | "loading" | "streaming">(
    "idle"
  );
  const [data, setData] = useState<T>(initialValue);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const abortController = new AbortController();
    (async () => {
      try {
        setStatus("loading");
        const reader = await streamFn(abortController.signal);
        setStatus("streaming");
        let result = await reader.read();
        while (!result.done) {
          const value = new TextDecoder().decode(result.value);
          for (const line of value.split("\n")) {
            if (!line) {
              continue;
            }
            if (line !== "ping") {
              setData((prev) => reducer(prev, line));
            }
          }
          result = await reader.read();
        }
        setStatus("idle");
      } catch (e) {
        console.log(e);
        setStatus("idle");
      }
    })();
    return () => abortController.abort();
  }, [enabled, streamKey]);

  return {
    status,
    data,
    isLoading: status === "loading",
    isStreaming: status === "streaming",
  };
}
