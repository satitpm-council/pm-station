import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logoutSession, verifySession } from "@station/server/auth";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await verifySession(request);
  if (session) {
    return redirect("/pm-station/app");
  } else {
    if (session === null) {
      // session was declared, but cannot proceed the request. log out
      return redirect("/pm-station", {
        headers: {
          "Set-Cookie": await logoutSession(request),
        },
      });
    }
  }
  return json({});
};
