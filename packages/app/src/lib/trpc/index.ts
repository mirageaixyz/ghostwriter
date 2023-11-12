import type { AppOutputs, AppRouter } from "@ghostwriter/server";
import { QueryClient } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { StreamQueryOptions, useStreamQuery } from "../hooks/useStreamQuery";

export const baseUrl =
  import.meta.env.VITE_SERVER_URL || "http://localhost:4000";

export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${baseUrl}/trpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});

type Status = NonNullable<AppOutputs["status"]>;

export const trpcStream = {
  status: {
    useStream(
      id: string,
      opts: Omit<StreamQueryOptions<Status>, "streamFn" | "reducer">
    ) {
      return useStreamQuery<Status>({
        ...opts,
        streamFn: async (signal) => {
          const res = await fetch(`${baseUrl}/trpc-stream/status/${id}`, {
            credentials: "include",
            signal,
          });
          if (!res.body) {
            throw new Error("No body");
          }
          if (res.status !== 200) {
            const text = await res.text();
            throw new Error(text);
          }
          return res.body.getReader();
        },
        reducer: (_, next) => JSON.parse(next) as any as Status,
      });
    },
  },
};
