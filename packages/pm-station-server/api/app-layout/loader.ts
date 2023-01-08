import type { DataFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { verifySession } from "@station/server/auth";
import type { User } from "@station/shared/user";

export type UserStore = {
  user: User;
};

export const loader = async ({ request }: DataFunctionArgs) => {
  const user = await verifySession(request);

  const { pathname } = new URL(request.url);
  if (!user) {
    return redirect(`/pm-station/?continueUrl=${pathname}`);
  }
  if (
    (user.role === undefined || !user.type) &&
    pathname !== "/pm-station/app/profile"
  ) {
    // WARN: This can't prevent client-side navigation.
    return redirect("/pm-station/app/profile");
  }

  return json<UserStore>({ user });
};
