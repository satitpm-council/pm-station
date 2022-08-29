import { Form, Outlet, useSearchParams, useTransition } from "@remix-run/react";
import { Audio } from "react-loader-spinner";
import { withTitle } from "~/utils/pm-station/title";

export const meta = withTitle("คำขอเพลง");

export default function SongRequests() {
  const transition = useTransition();
  const [params] = useSearchParams();
  return (
    <>
      <header className="flex flex-col gap-3">
        <h2 className="text-4xl font-bold">PM Music Request</h2>
        <span className="text-sm text-gray-300">
          ส่งคำขอเพลงสำหรับเปิดในรายการ
        </span>
      </header>
      <Form
        action="/pm-station/app/songrequests/search"
        className="flex flex-row flex-wrap gap-4 text-sm"
        autoComplete="off"
      >
        <input
          name="q"
          type="search"
          autoComplete="off"
          className="pm-station-btn pm-station-input"
          placeholder="ป้อนชื่อเพลงหรือศิลปิน"
          defaultValue={params.get("q") ?? undefined}
        />
        <button
          type="submit"
          className="bg-[#1fdf64] hover:bg-[#27cf65] focus:ring-[#27cf65] text-white pm-station-btn pm-station-focus-ring"
        >
          ค้นหา
        </button>
      </Form>
      {transition.state === "submitting" ? (
        <div className="flex flex-col gap-4 items-center justify-center py-6 opacity-75 text-sm">
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
