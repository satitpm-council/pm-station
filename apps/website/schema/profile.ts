import { z } from "zod";
import { userSchema } from "./user";

export const profileUpdateSchema = userSchema.pick({
  name: true,
  type: true,
});

export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
