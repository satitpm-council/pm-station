import type { FormEventHandler } from "react";
import { useMemo } from "react";
import { useState } from "react";

import { PageHeader } from "~/components/Header";
import { SubmitButton } from "~/components/SubmitButton";

import { options } from "~/utils/pm-station/songrequests/list";
import { useSafeParams } from "~/utils/params";
import { AdminSongRequest } from "~/components/SongRequest/admin";
import { ApproveTrackModal } from "~/components/TrackModal";
import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import {
  FilterOptions,
  SortOptions,
} from "~/components/SongRequest/admin/sort";
import type { MetaFunction } from "@remix-run/node";
import type { ListParams } from "~/utils/pm-station/songrequests";

export const meta: MetaFunction = () => ({
  title: "เพิ่มเพลงลงในรายการ",
});

export default function ListSongRequest() {
  const [track, viewTrack] = useState<SongRequestRecord>();
  const [settings, setParams] = useSafeParams<ListParams>(
    useMemo(
      () => ({ filter: "idle", order: "desc", sortBy: "lastUpdatedAt" }),
      []
    ),
    options
  );
  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    setParams(new FormData(e.target as HTMLFormElement).entries());
  };

  return (
    <>
      <PageHeader title={"เพิ่มเพลงลงในรายการ"}>
        คลิกเลือกเพลงที่ต้องการเปิด แล้วปิดหน้าต่างนี้เมื่อเสร็จสิ้น
      </PageHeader>
      <form onSubmit={onSubmit}>
        <fieldset className="flex flex-row gap-6 sm:gap-4 flex-wrap sm:items-center sm:justify-around text-sm max-w-lg">
          <SortOptions settings={settings} />
          <FilterOptions settings={settings} />
          <SubmitButton>ค้นหา</SubmitButton>
        </fieldset>
      </form>
      <ApproveTrackModal track={track} onClose={() => viewTrack(undefined)} />
      <AdminSongRequest onItemClick={viewTrack} {...settings} />
    </>
  );
}
