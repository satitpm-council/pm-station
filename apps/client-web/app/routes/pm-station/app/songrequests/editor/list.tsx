import type { LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { PageHeader } from "~/components/Header";
import { withTitle } from "~/utils/pm-station/client";
import type { ListParams } from "~/utils/pm-station/spotify/songrequests";
import { listSongRequests } from "~/utils/pm-station/spotify/songrequests";
import { json } from "@remix-run/node";
import type { SongRequestRecord } from "~/utils/pm-station/spotify/select";
import { SubmitButton } from "~/components/SubmitButton";
import dayjs from "dayjs";
import th from "dayjs/locale/th";
import localizedFormat from "dayjs/plugin/localizedFormat";
import duration from "dayjs/plugin/duration";

export const meta = withTitle("จัดการคำขอเพลง");

type ListSongRequestsResponse = {
  success: boolean;
  data?: SongRequestRecord[];
  params?: ListParams;
};

dayjs.locale(th);
dayjs.extend(duration);
dayjs.extend(localizedFormat);

type Options = {
  [K in keyof ListParams]: ListParams[K] extends string
    ? Partial<Record<ListParams[K], string>>
    : ListParams[K];
};

const options: Options = {
  sortBy: {
    lastUpdatedAt: "วันเวลาที่ส่ง",
    name: "ชื่อเพลง",
  },
  order: {
    asc: "ก่อน-หลัง",
    desc: "หลัง-ก่อน",
  },
  page: 0,
};

const defaults: ListParams = {
  page: 1,
  order: "asc",
  sortBy: "lastUpdatedAt",
};

const filterParams = (params: URLSearchParams): ListParams => {
  const input = params.entries() as unknown as IterableIterator<
    [keyof ListParams, string]
  >;
  let result = {} as Record<keyof ListParams, unknown>;
  for (const [key, value] of input) {
    const _default = defaults[key];
    const option = options[key];
    if (_default && option) {
      if (typeof option === "number") {
        result[key] = parseInt(value);
        result[key] = isNaN(result[key] as number) ? undefined : result[key];
      } else {
        result[key] = Object.keys(option).includes(value) ? value : undefined;
      }
    }
  }
  return Object.assign(defaults, result) as ListParams;
};
export const loader: LoaderFunction = async ({ request }) => {
  const params = filterParams(new URL(request.url).searchParams);
  console.log(params);
  try {
    const data = await listSongRequests(params);
    return json<ListSongRequestsResponse>({
      success: true,
      data,
      params,
    });
  } catch (err) {
    console.error(err);
    throw json<ListSongRequestsResponse>({ success: false }, 400);
  }
};
export default function ListSongRequest() {
  const transition = useTransition();
  const { data, params } = useLoaderData() as ListSongRequestsResponse;
  return (
    <>
      <PageHeader title={"จัดการคำขอเพลง"}>
        จัดการคำขอเพลงสำหรับเปิดในช่วง PM Music Request
      </PageHeader>
      <Form>
        <fieldset className="flex flex-row gap-6 sm:gap-4 flex-wrap sm:items-center sm:justify-around text-sm max-w-lg">
          <div className="flex flex-row gap-4 items-center flex-grow w-full sm:w-[unset]">
            <label htmlFor="sortBy" className="flex-shrink-0">
              จัดเรียงตาม
            </label>
            <select
              name="sortBy"
              className="pm-station-input w-full flex-grow text-sm"
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
                defaultChecked={params?.order === value}
                type="radio"
                id={value}
                name="order"
                value={value}
              />
              <label htmlFor={value}>{text}</label>
            </div>
          ))}

          <SubmitButton loading={transition.state === "submitting"}>
            ค้นหา
          </SubmitButton>
        </fieldset>
      </Form>
      {data && (
        <div className="flex flex-row flex-wrap gap-4">
          {data.map((track) => (
            <button
              key={track.id}
              className="w-full md:w-[unset] md:flex items-center justify-center bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 min-w-0 min-h-0 transition-colors"
            >
              <div className="items-center md:items-baseline px-4 py-3 md:p-6 flex flex-row md:flex-col gap-4 min-w-0 min-h-0 md:w-[200px] xl:w-[250px]">
                <div className="basis-1/4 min-w-[85px]">
                  <img
                    draggable={false}
                    className="w-full h-auto rounded-lg"
                    src={track.albumImage?.url}
                    alt={track.name}
                    title={`${track.name} - ${track.artists[0]}`}
                  />
                </div>
                <div className="basis-3/4 text-gray-300 max-w-full text-sm flex flex-grow text-left flex-col items-start min-w-0 min-h-0 truncate">
                  <b className="text-white text-base truncate min-w-0 w-full mb-1">
                    {track.explicit && (
                      <span
                        title="Explict"
                        className="text-sm bg-gray-500 text-white py-1 px-2 inline mr-2"
                      >
                        E
                      </span>
                    )}
                    {track.name}
                  </b>

                  <span className="truncate min-w-0 w-full">
                    {track.artists.join("/")}
                  </span>
                  <span>
                    {dayjs.duration(track.duration_ms).format("mm:ss")}
                  </span>
                  <span>
                    {dayjs(track.lastUpdatedAt).format("LL HH:mm น.")}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
