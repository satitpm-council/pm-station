import { headers } from "next/headers";
import { default as LoginPage } from "@station/client/login/page";
import { loader } from "@station/server/api/login";
import { asServerMiddleware } from "@station/server/next";

export default async function NextLoginPage() {
  await asServerMiddleware("/controller", headers(), loader);
  return <LoginPage />;
}
