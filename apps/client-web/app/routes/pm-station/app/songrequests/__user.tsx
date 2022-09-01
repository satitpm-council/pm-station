import { Form, Outlet, useSearchParams, useTransition } from "@remix-run/react";
import { Audio } from "react-loader-spinner";
import { PageHeader } from "~/components/Header";
import { withTitle } from "~/utils/pm-station/client";

export const meta = withTitle("ส่งคำขอเพลง");

export default function SongRequests() {
  const transition = useTransition();
  const [params] = useSearchParams();
  return (
    <>
      <PageHeader title={"PM Music Request"}>
        ส่งคำขอเพลงสำหรับเปิดในรายการ
      </PageHeader>
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
      {transition.state === "submitting" &&
      !transition.location.pathname.endsWith("/select") ? (
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
