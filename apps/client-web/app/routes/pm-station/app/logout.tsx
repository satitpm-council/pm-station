import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logoutSession } from "@station/server/auth/remix";

export const action: ActionFunction = async ({ request }) => {
  return redirect("/pm-station", {
    headers: {
      "Set-Cookie": await logoutSession(request),
    },
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  return redirect("/pm-station");
};
