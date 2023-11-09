import { z } from "zod";

export type User = z.infer<typeof User>;
export const User = z.object({
  id: z.string(),
  name: z.string().nullish().optional(),
  username: z.string(),
  waitlist: z.string().optional(),
});

export type Users = z.infer<typeof Users>;
export const Users = User.array();
