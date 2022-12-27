import { useNavigate } from "@remix-run/react";
import { useCallback } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { PageHeader } from "@station/client/layout";
import { withTitle } from "~/utils/pm-station/client";

import type { LinksFunction } from "@remix-run/node";

import reactCalendarCss from "react-calendar/dist/Calendar.css";
import customCalendarCss from "~/styles/calendar.css";
import CalendarView from "~/components/PlaylistEditor/CalendarView";

export const meta = withTitle("จัดการคำขอเพลง");

export const links: LinksFunction = () => [
  { href: reactCalendarCss, rel: "stylesheet" },
  { href: customCalendarCss, rel: "stylesheet" },
];

export default function ListSongRequest() {
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        title={"จัดการรายการเพลง"}
        button={{
          className: "bg-blue-500 hover:bg-blue-600",
          onClick: useCallback(
            () => navigate("/pm-station/app/songrequests/playlists/add"),
            [navigate]
          ),
          icon: PlusIcon,
          text: "เพิ่มรายการ",
        }}
      >
        จัดการรายการเพลง PM Music Request
      </PageHeader>
      <CalendarView />
    </>
  );
}
