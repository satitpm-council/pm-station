"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import dayjs, { UnitTypeShort } from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

function TimeItem({
  children,
  text,
}: {
  children: string;
  text: string;
}): JSX.Element {
  return (
    <div className="flex flex-col gap-1 w-16">
      <span className="text-3xl">{children}</span>
      <span className="sarabun-font text-sm">{text}</span>
    </div>
  );
}
const durations: UnitTypeShort[] = ["h", "m", "s"];

type Durations = typeof durations;

export default function Countdown(): JSX.Element {
  const [date, setDate] = useState(dayjs());
  const text = ["ชั่วโมง", "นาที", "วินาที"];
  useEffect(() => {
    const interval = setInterval(() => setDate(dayjs()), 1000);
    return () => clearInterval(interval);
  }, []);
  const getDate = useCallback(
    (unit: Durations[number]): string => {
      const d = dayjs.duration(
        dayjs().hour(10).minute(32).second(0).diff(date)
      );
      return Math.floor(d.get(unit)).toString().padStart(2, "0");
    },
    [date]
  );

  return (
    <div className="flex flex-row flex-wrap gap-2 font-medium w-44 sm:w-auto">
      {durations.map((d, i) => (
        <Fragment key={d}>
          <TimeItem text={text[i]}>{getDate(d)}</TimeItem>
          {i < duration.length - 1 && <span className="text-3xl">:</span>}
        </Fragment>
      ))}
    </div>
  );
}
