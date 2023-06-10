import { headers } from "next/headers";
import { default as LoginPage } from "@station/client/login/page";
import { loader } from "@station/server/api/login";
import { asServerMiddleware } from "@station/server/next";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default async function NextLoginPage() {
  await asServerMiddleware("/controller", headers(), loader);
  return <LoginPage />;
}
