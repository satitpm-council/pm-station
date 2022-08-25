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
    <div className="py-8 h-full min-h-screen flex flex-col items-center justify-center text-center gap-6">
      <h1 className="text-3xl font-bold">App</h1>
      <main className="px-6 py-8 flex-1 flex flex-col gap-6 w-full">
        <Outlet />
      </main>
    </div>
  );
}
