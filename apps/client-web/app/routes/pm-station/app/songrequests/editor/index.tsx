import type { FormEventHandler } from "react";
import { useState } from "react";

import { PageHeader } from "~/components/Header";
import { SubmitButton } from "~/components/SubmitButton";
import { withTitle } from "~/utils/pm-station/client";

import { options, defaults } from "~/utils/pm-station/songrequests/list";
import { useSongRequestSummary } from "~/utils/pm-station/songrequests";
import { useSafeParams } from "~/utils/params";
import { AdminSongRequest } from "~/components/SongRequest/admin";
import { ApproveTrackModal } from "~/components/TrackModal";
import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import {
  SortOptions,
  FilterOptions,
} from "~/components/SongRequest/admin/sort";

export const meta = withTitle("จัดการคำขอเพลง");

export default function ListSongRequest() {
  const [track, viewTrack] = useState<SongRequestRecord>();
  const [settings, setParams] = useSafeParams(defaults, options);
  const { data, mutate } = useSongRequestSummary();
  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    setParams(new FormData(e.target as HTMLFormElement).entries());
    mutate();
  };
  return (
    <>
      <PageHeader title={"จัดการคำขอเพลง"}>
        จัดการคำขอเพลงสำหรับเปิดในช่วง PM Music Request
      </PageHeader>
      <form onSubmit={onSubmit}>
        <fieldset className="flex flex-row gap-6 sm:gap-4 flex-wrap sm:items-center sm:justify-around text-sm max-w-lg">
          <SortOptions settings={settings} />
          <FilterOptions settings={settings} />
          <SubmitButton>ค้นหา</SubmitButton>
        </fieldset>
      </form>
      {data && data.validated && (
        <div className="text-sm">
          มีผู้ส่งคำขอทั้งหมด {data.submissionCount} คน {data.trackCount} เพลง
        </div>
      )}
      <ApproveTrackModal track={track} onClose={() => viewTrack(undefined)} />
      <AdminSongRequest onItemClick={viewTrack} {...settings} />
    </>
  );
}
