import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { json } from "remix-utils";
import { verifySession } from "~/utils/pm-station/auth.server";
import { UserRole } from "~/utils/pm-station/client";

export const loader: LoaderFunction = async ({ request: { headers } }) => {
  const user = await verifySession(headers);
  if (user?.role && user?.role >= UserRole.EDITOR && user?.type) {
    return json({});
  }
  return redirect("/pm-station/app/songrequests");
};

export default function Editor() {
  return <Outlet />;
}
