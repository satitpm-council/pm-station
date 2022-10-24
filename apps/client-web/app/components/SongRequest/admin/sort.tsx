import type { ChangeEventHandler } from "react";
import { useCallback, useEffect, useRef } from "react";
import { useNumericMenu, useSortBy } from "react-instantsearch-hooks-web";
import { SortItems } from "~/utils/pm-station/songrequests";
import { SongRequestListStore } from "./store";

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
    items: SortItems,
  });

  const onChange: ChangeEventHandler<HTMLSelectElement> = useCallback(
    (e) => {
      refine(e.target.value);
    },
    [refine]
  );

  const SortItemsMap = useRef(new Map(SortItems.map((v) => [v.label, v])));

  useEffect(() => {
    const isRefinedItem = items.find(({ isRefined }) => isRefined);
    if (!isRefinedItem) return;
    const SortItem = SortItemsMap.current.get(isRefinedItem.label);
    if (!SortItem) return;

    SongRequestListStore.setState({
      filterStatus: SortItem.name,
    });
  }, [items]);

  return (
    <div className="flex flex-row gap-4 items-center flex-grow sm:max-w-[20rem]">
      <label htmlFor="filter" className="flex-shrink-0">
        แสดงคำขอเพลง
      </label>
      <select
        name="filter"
        className="pm-station-input w-full flex-grow text-sm"
        onChange={onChange}
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
