import { getServerSession } from "next-auth";
import options from "@/auth";
import { isRegistered } from "./utils";

export const getSession = async () => {
  const session = await getServerSession(options);
  return {
    ...(session ?? {}),
    isRegistered: isRegistered(session?.user),
  };
};
