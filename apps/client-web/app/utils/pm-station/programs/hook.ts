import { useCollection } from "@lemasc/swr-firestore";
import { UserRole, useUser } from "../client";

type Program = {
  name: string;
};

export const usePrograms = () => {
  const { user } = useUser();
  return useCollection<Program>(
    user && user.role && user.role > UserRole.USER ? "programs" : null
  );
};
