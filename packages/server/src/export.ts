import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { router } from "./router.js";

export type AppRouter = typeof router;
export type AppInputs = inferRouterInputs<AppRouter>;

export type AppOutputs = inferRouterOutputs<AppRouter>;
