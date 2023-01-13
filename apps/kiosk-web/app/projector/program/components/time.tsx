"use client";

import { projectorStore } from "kiosk-web/store/projector";

export default function Time() {
  const date = projectorStore((state) => state.datetime);
  return (
    <div className="space-x-2 text-4xl font-bold" suppressHydrationWarning>
      <span>{date.format("HH")}</span>
      <span className="">:</span>
      <span>{date.format("mm")}</span>
    </div>
  );
}
