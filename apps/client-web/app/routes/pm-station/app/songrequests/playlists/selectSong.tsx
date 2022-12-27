import { useState } from "react";

import { PageHeader } from "@station/client/layout";
import { AdminSongRequest } from "~/components/SongRequest/admin";
import { AdminTrackModal } from "~/components/TrackModal";
import type { SongRequestSearchRecord } from "@station/shared/schema/types";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => ({
  title: "เพิ่มเพลงลงในรายการ",
});

export default function ListSongRequest() {
  const [track, viewTrack] = useState<SongRequestSearchRecord>();
  return (
    <>
      <PageHeader title={"เพิ่มเพลงลงในรายการ"}>
        คลิกเลือกเพลงที่ต้องการเปิด แล้วปิดหน้าต่างนี้เมื่อเสร็จสิ้น
      </PageHeader>
      <AdminTrackModal
        type="addToPlaylist"
        track={track}
        onClose={() => viewTrack(undefined)}
      />
      <AdminSongRequest onItemClick={viewTrack} />
    </>
  );
}
