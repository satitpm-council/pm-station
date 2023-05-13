import "react-pro-sidebar/dist/css/styles.css";
import "@/styles/sidebar.css";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { SessionProvider } from "@/auth/client";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="overflow-hidden flex items-stretch h-screen gap-4 bg-gradient-to-b from-[#151515] to-[#121212] text-white">
        <Sidebar />
        <div
          id="app"
          className="flex flex-col overflow-auto h-full min-h-screen w-full"
        >
          <Navbar />
          <main
            className={`px-6  py-4 lg:px-8 lg:pt-12 pb-12 flex-1 flex flex-col gap-6`}
          >
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
