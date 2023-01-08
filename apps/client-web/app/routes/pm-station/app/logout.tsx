import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export { action } from "@station/server/api/logout/action";

export const loader: LoaderFunction = async ({ request }) => {
  return redirect("/pm-station");
};
