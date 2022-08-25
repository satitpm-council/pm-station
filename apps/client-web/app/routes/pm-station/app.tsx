import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request: { url } }) => {
  console.log("Hello", url);
  //return redirect("/pm-station");
  return json({});
};

export default function Index() {
  return (
    <div className="h-full min-h-screen flex flex-col items-center justify-center text-center gap-6">
      <h1 className="text-3xl font-bold">Welcome to Remix App Nesyed</h1>
      <Outlet />
    </div>
  );
}
