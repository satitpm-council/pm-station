"use client";

import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

export default function Time() {
  const [date, setDate] = useState<Dayjs>(dayjs());
  useEffect(() => {
    const interval = setInterval(() => setDate(dayjs()), 1000 * 60);
    return () => {
      console.log("Remove");
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="space-x-2 text-4xl font-bold">
      <span>{date.format("HH")}</span>
      <span className="">:</span>
      <span>{date.format("mm")}</span>
    </div>
  );
}
