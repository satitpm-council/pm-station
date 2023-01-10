"use client";

import { ToastContainer } from "react-toastify";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastContainer
        position="top-right"
        closeOnClick
        draggable
        theme="dark"
      />
      {children}
    </>
  );
}
