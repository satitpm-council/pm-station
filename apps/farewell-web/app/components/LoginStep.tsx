"use client";

import { useCallback } from "react";

export default function LoginStep({ children }: { children: React.ReactNode }) {
  const onSubmit: React.FormEventHandler<HTMLFormElement> = useCallback((e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
  }, []);
  return (
    <form
      onSubmit={onSubmit}
      className="my-4 p-6 bg-white shadow-lg rounded-lg text-center flex flex-col gap-4"
    >
      {children}
    </form>
  );
}
