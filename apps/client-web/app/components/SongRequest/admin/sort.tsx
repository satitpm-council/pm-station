import type { ListParams } from "~/utils/pm-station/songrequests";
import { options } from "~/utils/pm-station/songrequests";

export function SortOptions({ settings }: { settings: ListParams }) {
  return (
    <>
      <div className="flex flex-row gap-4 items-center flex-grow w-full sm:w-[unset]">
        <label htmlFor="sortBy" className="flex-shrink-0">
          จัดเรียงตาม
        </label>
        <select
          name="sortBy"
          className="pm-station-input w-full flex-grow text-sm"
          defaultValue={settings.sortBy}
        >
          {Object.entries(options["sortBy"]).map(([value, text]) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </select>
      </div>
      {Object.entries(options["order"]).map(([value, text]) => (
        <div key={value} className="flex flex-row gap-2 items-center">
          <input
            defaultChecked={settings.order === value}
            type="radio"
            id={value}
            name="order"
            value={value}
          />
          <label htmlFor={value}>{text}</label>
        </div>
      ))}
    </>
  );
}

export function FilterOptions({ settings }: { settings: ListParams }) {
  return (
    <div className="flex flex-row gap-4 items-center flex-grow">
      <label htmlFor="filter" className="flex-shrink-0">
        แสดงข้อมูล
      </label>
      <select
        name="filter"
        className="pm-station-input w-full flex-grow text-sm"
        defaultValue={settings.filter}
      >
        {Object.entries(options["filter"]).map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </div>
  );
}
