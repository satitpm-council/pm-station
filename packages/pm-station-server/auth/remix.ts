import { commitSession, getSession } from "./session";
import { createAuthenticityToken, verifyAuthenticityToken } from "remix-utils";
import { verifySession } from "./index";

export const createCSRFToken = async (headers: Request["headers"]) => {
  const session = await getSession(headers.get("Cookie"));
  return {
    csrf: createAuthenticityToken(session, "sessionToken"),
    headers: async () => ({
      headers: { "Set-Cookie": await commitSession(session) },
    }),
  };
};

export const verifyCSRFToken = async (request: Request) => {
  const user = await verifySession(request);
  if (!user) throw new Error("No user!");
  const session = await getSession(request.headers.get("Cookie"));
  await verifyAuthenticityToken(request, session, "sessionToken");
  return user;
};

export * from "./index";
