import type { ChangeEventHandler } from "react";
import { useCallback } from "react";
import { useSortBy } from "react-instantsearch-hooks-web";

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
      <div className="flex flex-row gap-4 items-center flex-grow w-full sm:w-[unset]">
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
