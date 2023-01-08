import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { verifySession } from "@station/server/auth";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await verifySession(request);
  if (session) {
    return redirect("/controller/app");
  } else {
    if (session === null) {
      // we can't unset the session as of now, so we redirect to the logout page
      return redirect("/api/logout");
    }
  }
  return json({});
};
