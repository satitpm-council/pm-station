"use client";

import { TrackModal } from "@/components/music-interactions";
import dayjs from "@/shared/dayjs";
import { songRequestModalStore } from "@/shared/modalStore";

export const ViewSongRequestModal = () => {
  const selected = songRequestModalStore((state) => state.selected);
  return (
    <TrackModal>
      {selected && selected.type === "record" && (
        <div className="flex flex-col gap-2 text-sm">
          <span>คนส่งคำขอทั้งหมด {selected.data.submissionCount} คน</span>
          <span>
            เปลี่ยนแปลงล่าสุดเมื่อ{" "}
            {dayjs(selected.metadata.updatedAt).format("LLL น.")}
          </span>
        </div>
      )}
    </TrackModal>
  );
};
