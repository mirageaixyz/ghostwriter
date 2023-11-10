import type { AppOutputs } from "@ghostwriter/server";
import {
  createContext,
  useContext,
  useEffect,
  type FC,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import { useSearchParam } from "../hooks/useSearchParam";
import { trpc } from "../trpc";

export type Me =
  | { isUserLoading: true }
  | { isUserLoading: false; user: AppOutputs["me"] };

export const MeContext = createContext<Me>({ isUserLoading: true });

export const MeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [justLoggedIn, setJustLoggedIn] = useSearchParam("justLoggedIn");
  const { data: user, isLoading: isUserLoading } = trpc.me.useQuery(undefined, {
    keepPreviousData: true,
  });
  const me = isUserLoading
    ? { isUserLoading }
    : { isUserLoading: false, user: user ?? null };

  useEffect(() => {
    if (!justLoggedIn || isUserLoading || !user) return;

    toast.success("Logged in successfully!");
    setJustLoggedIn(undefined);
  }, [isUserLoading, user, justLoggedIn, setJustLoggedIn]);

  return <MeContext.Provider value={me}>{children}</MeContext.Provider>;
};

export function useMe() {
  return useContext(MeContext);
}
