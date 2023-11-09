import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "./data/user.js";
import { session as getSession } from "./lib/oauth.js";

export async function createContext({
  req,
  resHeaders,
}: FetchCreateContextFnOptions): Promise<Context> {
  const session = await getSession(req);
  return { req, session, user: session?.user, headers: resHeaders };
}

export type Context = {
  req: Request;
  session?: { user: User; sessionId: string };
  user?: User;
  headers: Headers;
};
