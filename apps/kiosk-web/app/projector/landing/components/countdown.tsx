"use client";

import { Fragment, useCallback, useMemo } from "react";
import dayjs, { UnitTypeShort } from "dayjs";
import duration from "dayjs/plugin/duration";
import { projectorStore } from "kiosk-web/store/projector";
import { usePlaylist } from "@station/client/playlists";
import { controllerStore } from "kiosk-web/store/controller";
import { isDocumentValid } from "@lemasc/swr-firestore";
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
  const date = projectorStore((state) => state.datetime);

  const text = ["ชั่วโมง", "นาที", "วินาที"];

  const playlistId = controllerStore((state) => state.playlistId);
  const { data, error } = usePlaylist(playlistId);
  const queuedDate = useMemo(
    () => (data && isDocumentValid(data) ? data.queuedDate : null),
    [data]
  );

  const getDate = useCallback(
    (unit: Durations[number]): string => {
      if (!queuedDate) return "--";
      const d = dayjs.duration(dayjs(queuedDate).diff(date));
      const value = Math.floor(d.get(unit));
      if (value > 0) {
        return Math.floor(d.get(unit)).toString().padStart(2, "0");
      } else {
        return "00";
      }
    },
    [date, queuedDate]
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
