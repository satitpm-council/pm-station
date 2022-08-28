import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request: { url } }) => {
  console.log("Hello", url);
  //return redirect("/pm-station");
  return json({});
};

export default function Index() {
  return (
    <div className="h-full min-h-screen text-center gap-6 bg-gradient-to-b from-[#151515] to-[#121212] text-white">
      <nav className="flex flex-row gap-6 bg-gray-500 bg-opacity-10 w-full sticky top-0 backdrop-blur-sm px-8 py-4">
        <Link
          to="/pm-station/app"
          title="PM Station"
          className="flex gap-4 items-center"
        >
          <img src="/logo.png" alt="Logo" width="50" height="50" />
          <h1 className="text-2xl font-bold">PM Station</h1>
        </Link>
      </nav>
      <main className="px-6 py-8 flex-1 flex flex-col gap-4 w-full">
        <Outlet />
      </main>
    </div>
  );
}
