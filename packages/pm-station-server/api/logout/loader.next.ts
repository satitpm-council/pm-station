import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logoutSession } from "@station/server/auth";

export const loader: LoaderFunction = async ({ request }) => {
  return redirect("/controller", {
    headers: {
      "Set-Cookie": await logoutSession(request),
    },
  });
};
