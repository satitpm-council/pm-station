import { getServerSession } from "next-auth";
import options from "@/auth";

export const getSession = async () => {
  const session = await getServerSession(options);
  return {
    ...(session ?? {}),
    isRegistered: !!session?.user?.type,
  };
};
