import type { FormEventHandler } from "react";
import { useMemo } from "react";
import { Outlet, useSearchParams } from "@remix-run/react";

import { PageHeader } from "~/components/Header";
import { SubmitButton } from "~/components/SubmitButton";
import { withTitle } from "~/utils/pm-station/client";

import {
  filterParams,
  options,
  defaults,
} from "~/utils/pm-station/songrequests/list";

export const meta = withTitle("จัดการคำขอเพลง");

export default function ListSongRequest() {
  const [params, setParams] = useSearchParams();
  const settings = useMemo(
    () => Object.assign(defaults, filterParams(params.entries())),
    [params]
  );

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    const params = filterParams(
      new FormData(e.target as HTMLFormElement).entries()
    );
    setParams(Object.entries(params) as any, {
      replace: true,
    });
  };

  return (
    <>
      <PageHeader title={"จัดการคำขอเพลง"}>
        จัดการคำขอเพลงสำหรับเปิดในช่วง PM Music Request
      </PageHeader>
      <form onSubmit={onSubmit}>
        <fieldset className="flex flex-row gap-6 sm:gap-4 flex-wrap sm:items-center sm:justify-around text-sm max-w-lg">
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

          <SubmitButton>ค้นหา</SubmitButton>
        </fieldset>
      </form>
      <Outlet context={settings} />
    </>
  );
}
