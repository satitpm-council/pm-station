import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useMatches } from "@remix-run/react";
import { ProSidebar } from "react-pro-sidebar";

import sidebar from "react-pro-sidebar/dist/css/styles.css";
import sidebarOverrides from "~/styles/sidebar.css";
import { Header } from "~/components/Header";
import type { User } from "~/utils/pm-station/client";
import { verifySession } from "~/utils/pm-station/auth.server";
import { Bars4Icon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import Sidebar from "~/components/Sidebar";
import { useFirebase } from "~/utils/firebase";
import { useAuthenticityToken } from "remix-utils";
import axios from "axios";
import { toFormData } from "~/utils/api";
import type {
  ActionWithSession,
  SessionActionResponse,
} from "~/utils/pm-station/api-types";
import { signInWithCustomToken } from "firebase/auth";

type UserStore = {
  user: User;
};

export const unstable_shouldReload = () => true;

export const loader: LoaderFunction = async ({ request: { url, headers } }) => {
  const user = await verifySession(headers);

  const { pathname } = new URL(url);
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

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: sidebar },
  { rel: "stylesheet", href: sidebarOverrides },
];

export default function Index() {
  const [open, setOpen] = useState(false);
  const matches = useMatches();
  useEffect(() => {
    setOpen(false);
  }, [matches]);

  const { auth } = useFirebase("pm-station");
  const sessionToken = useAuthenticityToken();
  useEffect(() => {
    if (!sessionToken) return;
    if (!auth.currentUser) {
      // It is possibly that the firebase client SDK hasn't initialized yet.
      // Maybe from a new browsing session.
      // Grab the sign-on token from backend.
      (async () => {
        try {
          const {
            data: { token },
          } = await axios.post<SessionActionResponse>(
            "/pm-station/session",
            toFormData<ActionWithSession>({ sessionToken })
          );
          await signInWithCustomToken(auth, token);
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, [auth, sessionToken]);

  return (
    <div className="overflow-hidden flex  items-stretch h-screen gap-4 bg-gradient-to-b from-[#151515] to-[#121212] text-white">
      <ProSidebar toggled={open} onToggle={setOpen} breakPoint="md">
        <Sidebar />
      </ProSidebar>
      <div className="flex flex-col overflow-auto h-full min-h-screen w-full">
        <nav className="flex flex-row gap-1 items-center px-4 py-2 md:hidden">
          <button
            title="เปิดแถบนำทาง"
            onClick={() => setOpen(true)}
            className="rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors p-2.5"
          >
            <Bars4Icon className="h-5 w-5" />
          </button>
          <Link to="/pm-station/app" title="PM Station" className="scale-90">
            <Header />
          </Link>
        </nav>
        <main className="px-6 md:px-8 py-4 md:pt-12 pb-12 flex-1 flex flex-col gap-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
