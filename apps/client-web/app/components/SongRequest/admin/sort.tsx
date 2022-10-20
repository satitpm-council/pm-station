import type { ChangeEventHandler } from "react";
import { useCallback } from "react";
import { useNumericMenu, useSortBy } from "react-instantsearch-hooks-web";
import { LastPlayedDate } from "~/utils/pm-station/songrequests/date";

export function SortOptions() {
  const { options, refine } = useSortBy({
    items: [
      { label: "ชื่อ", value: "station_songrequests" },
      {
        label: "วัน-เวลาส่ง",
        value: "station_songrequests_lastUpdatedAt_desc",
      },
    ],
  });
  const onChange: ChangeEventHandler<HTMLSelectElement> = useCallback(
    (e) => {
      refine(e.currentTarget.value);
    },
    [refine]
  );
  return (
    <>
      <div className="flex flex-row gap-4 items-center flex-grow w-full sm:max-w-[13rem]">
        <label htmlFor="sortBy" className="flex-shrink-0">
          จัดเรียงตาม
        </label>
        <select
          name="sortBy"
          className="pm-station-input w-full flex-grow text-sm"
          onChange={onChange}
        >
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export function FilterOptions() {
  const { items, refine } = useNumericMenu({
    attribute: "lastPlayedAt",
    items: [
      {
        label: "ทั้งหมด",
      },
      {
        label: "ยังไม่ถูกเล่น",
        start: LastPlayedDate.Idle.valueOf(),
        end: LastPlayedDate.Idle.valueOf(),
      },
      {
        label: "เล่นไปแล้ว",
        start: LastPlayedDate.Idle.valueOf() + 1,
      },
      {
        label: "ถูกปฏิเสธ",
        end: LastPlayedDate.Rejected.valueOf(),
      },
    ],
  });

  return (
    <div className="flex flex-row gap-4 items-center flex-grow sm:max-w-[20rem]">
      <label htmlFor="filter" className="flex-shrink-0">
        แสดงคำขอเพลง
      </label>
      <select
        name="filter"
        className="pm-station-input w-full flex-grow text-sm"
        onChange={(e) => refine(e.target.value)}
      >
        {items.map(({ label, value, isRefined }) => (
          <option selected={isRefined} key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
