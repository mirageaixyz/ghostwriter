/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./lib/lucia.js").Auth;
  type DatabaseUserAttributes = {
    name?: string | undefined | null;
    username: string;
    waitlist?: string | undefined | null;
  };
  type DatabaseSessionAttributes = {};
}
