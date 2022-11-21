import { useCollection } from "@lemasc/swr-firestore";
import { Program } from "~/schema/pm-station/programs/schema";
import { UserRole, useUser } from "../client";
import { zodValidator } from "../zodValidator";

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
