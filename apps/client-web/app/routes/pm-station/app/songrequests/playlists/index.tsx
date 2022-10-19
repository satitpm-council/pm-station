import { Link, useNavigate } from "@remix-run/react";
import { useCallback } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { isDocumentValid } from "@lemasc/swr-firestore";
import { PageHeader } from "~/components/Header";
import { withTitle } from "~/utils/pm-station/client";
import { usePlaylists } from "~/utils/pm-station/playlists/hook";
import dayjs from "~/utils/dayjs";

export const meta = withTitle("จัดการคำขอเพลง");

export default function ListSongRequest() {
  const { data } = usePlaylists();
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
      <div className="flex flex-col gap-4">
        {data?.filter(isDocumentValid).map((p) => (
          <Link
            to={`/pm-station/app/songrequests/playlists/${p.id}`}
            key={p.id}
          >
            <div className="flex flex-col text-sm gap-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg px-6 py-4">
              <b className="text-lg font-bold">
                {dayjs(p.queuedDate).format("ll")}
              </b>
              <span>จำนวนเพลงในรายการ: {p.totalTracks}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
