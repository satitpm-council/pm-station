"use client";

import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { projectorStore } from "kiosk-web/store/projector";

export default function Time() {
  const date = projectorStore((state) => state.datetime);
  return (
    <div className="space-x-2 text-4xl font-bold">
      <span>{date.format("HH")}</span>
      <span className="">:</span>
      <span>{date.format("mm")}</span>
    </div>
  );
}
