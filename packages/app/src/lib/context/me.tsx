import type { AppOutputs } from "@ghostwriter/server";
import { createContext, useContext, type FC, type ReactNode } from "react";
import { trpc } from "../trpc";

export type Me =
  | { isUserLoading: true }
  | { isUserLoading: false; user: AppOutputs["me"] };

export const MeContext = createContext<Me>({ isUserLoading: true });

export const MeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { data: user, isLoading: isUserLoading } = trpc.me.useQuery(undefined, {
    keepPreviousData: true,
  });
  const me = isUserLoading
    ? { isUserLoading }
    : { isUserLoading: false, user: user ?? null };
  return <MeContext.Provider value={me}>{children}</MeContext.Provider>;
};

export function useMe() {
  return useContext(MeContext);
}
