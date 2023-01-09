import type { DataFunctionArgs } from "@remix-run/node";
import { notFound } from "next/navigation";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { verifySession } from "@station/server/auth";
import { User, UserRole } from "@station/shared/user";

export type UserStore = {
  user: User;
};

export const loader = async ({ request }: DataFunctionArgs) => {
  const user = await verifySession(request);

  const { pathname } = new URL(request.url);
  if (!user) {
    return redirect(`/controller/?continueUrl=${pathname}`);
  }
  if (user.role && user.role >= UserRole.EDITOR && user.type === "student") {
    return json<UserStore>({ user });
  }
  return notFound();
};
