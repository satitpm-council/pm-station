import { Form, Outlet, useSearchParams, useTransition } from "@remix-run/react";
import { Audio } from "react-loader-spinner";

export default function SongRequests() {
  const transition = useTransition();
  const [params] = useSearchParams();
  return (
    <>
      <h2 className="text-xl font-bold">PM Music Request</h2>
      <Form
        action="/pm-station/app/songrequests/search"
        className="flex flex-row flex-wrap gap-4 items-center justify-center"
      >
        <input
          name="q"
          type="search"
          className="rounded border px-4 py-2 bg-stone-700 border-stone-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-4 focus:ring-offset-[#151515]"
          placeholder="ป้อนชื่อเพลงหรือศิลปิน"
          defaultValue={params.get("q") ?? undefined}
        />
        <button
          type="submit"
          className="bg-[#1fdf64] hover:bg-[#27cf65] text-white px-4 py-2 rounded"
        >
          ค้นหา
        </button>
      </Form>
      {transition.state === "submitting" ? (
        <div className="flex flex-col gap-4 items-center justify-center py-4 opacity-75">
          <Audio
            height="50"
            width="50"
            color="white"
            ariaLabel="three-dots-loading"
          />
          <span>กำลังค้นหา...</span>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
}
