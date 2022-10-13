import { PageHeader } from "~/components/Header";
import { withTitle } from "~/utils/pm-station/client";
import { usePlaylists } from "~/utils/pm-station/playlists/hook";
import { isDocumentValid } from "@lemasc/swr-firestore";
import dayjs from "~/utils/dayjs";

export const meta = withTitle("จัดการคำขอเพลง");

export default function ListSongRequest() {
  const { data } = usePlaylists();
  return (
    <>
      <PageHeader title={"จัดการรายการเพลง"}>
        จัดการรายการเพลง PM Music Request
      </PageHeader>
      <div className="flex flex-col gap-4">
        {data?.filter(isDocumentValid).map((p) => (
          <div
            key={p.id}
            className="flex flex-col text-sm gap-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg px-6 py-4"
          >
            <b className="text-lg font-bold">
              {dayjs(p.queuedDate).format("ll")}
            </b>
            <span>จำนวนเพลงในรายการ: {p.totalTracks}</span>
          </div>
        ))}
      </div>
    </>
  );
}
