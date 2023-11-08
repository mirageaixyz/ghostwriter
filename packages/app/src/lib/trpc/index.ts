import type { AppRouter } from "@ghostwriter/server";
import { QueryClient } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";

export const baseUrl =
  import.meta.env.VITE_SERVER_URL ?? "http://localhost:4000";

export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${baseUrl}/trpc`,
    }),
  ],
});
