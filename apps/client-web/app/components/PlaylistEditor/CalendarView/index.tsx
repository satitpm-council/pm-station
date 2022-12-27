import { useCallback, useMemo, useRef, useState } from "react";
import type { CalendarTileProperties } from "react-calendar";
import Calendar from "react-calendar";
import { SpeakerWaveIcon } from "@heroicons/react/20/solid";

import dayjs from "shared/dayjs";
import { usePlaylists } from "~/utils/pm-station/playlists/hook";
import PlaylistDetail from "./detail";
import type { PlaylistMetadataProps } from "./meta";
import { PlaylistMetadata } from "./meta";
import { useScrollAnimation } from "./useScrollAnimation";

const HasItemBadge = () => {
  return (
    <div className="has-item-badge-view" title="มีรายการแล้ว">
      <SpeakerWaveIcon />
    </div>
  );
};
export default function CalendarView() {
  const { getRecordFromDate, datesSet } = usePlaylists();
  const [date, setDate] = useState(new Date());

  const currentData = useMemo(
    () => getRecordFromDate(date),
    [date, getRecordFromDate]
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const getTileContent: (props: CalendarTileProperties) => JSX.Element | null =
    useCallback(
      ({ date, view }) =>
        view === "month" && datesSet.has(date.toDateString()) ? (
          <HasItemBadge />
        ) : null,
      [datesSet]
    );

  const top = useScrollAnimation();

  const PlaylistMetaWithDate = useCallback(
    (props: PlaylistMetadataProps) => (
      <PlaylistMetadata {...props}>
        วันที่ {dayjs(date).format("LL")}
      </PlaylistMetadata>
    ),
    [date]
  );

  return (
    <div className="-mt-10 flex items-start flex-col lg:flex-row lg:gap-6 xl:gap-10 relative">
      <div className="pt-10 lg:flex-shrink-0 xl:basis-[33%] 2xl:basis-2/5 lg:sticky lg:top-0">
        <Calendar
          tileContent={getTileContent}
          value={date}
          onChange={setDate}
          calendarType="US"
        />
        <PlaylistMetaWithDate side animate={!top} playlist={currentData} />
      </div>
      <div ref={scrollRef} className="flex flex-col flex-grow lg:pt-10">
        <PlaylistMetaWithDate animate={top} playlist={currentData} />
        <PlaylistDetail scrollRef={scrollRef} playlistId={currentData?.id} />
      </div>
    </div>
  );
}
