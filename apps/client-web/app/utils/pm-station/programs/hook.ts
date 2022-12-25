import { useCollection } from "@lemasc/swr-firestore";
import { Program } from "@station/shared/schema";
import { UserRole, useUser } from "../client";
import { zodValidator } from "shared/utils";

export const usePrograms = () => {
  const { user } = useUser();
  return useCollection(
    user && user.role && user.role > UserRole.USER ? "programs" : null,
    {},
    {
      validator: zodValidator(Program),
    }
  );
};
