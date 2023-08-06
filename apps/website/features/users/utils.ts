import { WithXataMetadata, XataRecord } from "@station/db/src";
import { User, userSchema } from "@/schema/user";

export const userWithMetadata = (user: XataRecord): WithXataMetadata<User> => {
  const userData = userSchema.parse(user.toSerializable());
  return {
    ...userData,
    metadata: user.xata,
  };
};
