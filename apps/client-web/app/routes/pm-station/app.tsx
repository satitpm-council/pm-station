import type { LinksFunction } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";

import sidebar from "react-pro-sidebar/dist/css/styles.css";
import sidebarOverrides from "~/styles/sidebar.css";
import { Header } from "@station/client/layout";
import { Bars4Icon, XMarkIcon } from "@heroicons/react/20/solid";
import { useCallback, useEffect, useState } from "react";
import Sidebar from "~/components/Sidebar";
import { useFirebase } from "@station/client/firebase";
import { useAuthenticityToken } from "remix-utils";
import axios from "axios";
import { toFormData } from "@station/shared/api";
import type {
  ActionWithSession,
  SessionActionResponse,
} from "@station/shared/api";
import { signInWithCustomToken } from "firebase/auth";

export const unstable_shouldReload = () => true;

export { loader } from "@station/server/api/app-layout";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: sidebar },
  { rel: "stylesheet", href: sidebarOverrides },
];

export default function Index() {
  const [open, setOpen] = useState(false);
  const { auth } = useFirebase();
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

  const [isPopup, setIsPopup] = useState(false);

  useEffect(() => {
    setIsPopup(window.opener !== null);
  }, []);

  const openMenu = useCallback(() => setOpen(true), []);
  const closePopup = useCallback(() => window.close(), []);
  return (
    <div className="overflow-hidden flex  items-stretch h-screen gap-4 bg-gradient-to-b from-[#151515] to-[#121212] text-white">
      {!isPopup && <Sidebar open={open} setOpen={setOpen} />}
      <div
        id="app"
        className="flex flex-col overflow-auto h-full min-h-screen w-full"
      >
        <nav className="flex flex-row gap-1 items-center px-4 py-2 lg:hidden">
          <button
            title={isPopup ? "ปิดหน้าต่าง" : "เปิดแถบนำทาง"}
            onClick={isPopup ? closePopup : openMenu}
            className="rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors p-2.5"
          >
            {isPopup ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <Bars4Icon className="h-5 w-5" />
            )}
          </button>
          <Link to="/pm-station/app" title="PM Station" className="scale-90">
            <Header />
          </Link>
        </nav>
        <main className="px-6 lg:px-8 py-4 lg:pt-12 pb-12 flex-1 flex flex-col gap-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
