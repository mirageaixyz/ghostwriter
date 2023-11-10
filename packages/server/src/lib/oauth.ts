import { OAuthRequestError } from "@lucia-auth/oauth";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { sql } from "../data/pg.js";
import { Users } from "../data/user.js";
import { env } from "./env.js";
import { auth, github } from "./lucia.js";

export const oauth = new Hono();

export async function session(req: Request) {
  const authRequest = auth.handleRequest(req);
  const session = await authRequest.validate();
  if (!session) {
    return undefined;
  }

  try {
    const id = session.user.userId;
    const rows = await sql`SELECT * FROM users WHERE id = ${id}`;
    const users = await Users.safeParseAsync(rows);
    if (!users.success) {
      return undefined;
    }
    const user = users.data.at(0);
    if (!user) {
      return undefined;
    }
    return { user, sessionId: session.sessionId };
  } catch (e) {
    return undefined;
  }
}

oauth.get("/github", async (c) => {
  const [url, state] = await github.getAuthorizationUrl();

  setCookie(c, "github_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60,
  });

  return c.redirect(url.toString());
});

oauth.get("/github/callback", async (c) => {
  const storedState = getCookie(c, "github_oauth_state");
  const { code, state } = c.req.query();

  // Validate the state
  if (!storedState || !state || storedState !== state || !code) {
    return c.text("Login failed, invalid state. Please try again!", 400);
  }

  try {
    const { getExistingUser, githubUser, createUser } =
      await github.validateCallback(code);

    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;
      const user = await createUser({
        attributes: {
          username: githubUser.login,
          waitlist: "waiting",
        },
      });
      return user;
    };

    const user = await getUser();
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const sessionCookie = auth.createSessionCookie(session);

    // Redirect back to app
    return new Response(null, {
      headers: {
        Location:
          env.NODE_ENV === "PROD"
            ? "https://ghostwriter.mirageai.xyz?justLoggedIn=true"
            : "http://localhost:5173?justLoggedIn=true",
        "Set-Cookie": sessionCookie.serialize(),
      },
      status: 302,
    });
  } catch (e) {
    if (e instanceof OAuthRequestError) {
      return c.text(
        `Login failed, ${
          e.cause ?? "cannot authenticated to github"
        }. Please try again!`,
        400
      );
    }
    return c.text("Login failed, system issues. Please try again!", 500);
  }
});
