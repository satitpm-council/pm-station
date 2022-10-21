import { memo, useCallback, useEffect, useRef } from "react";
import type { ChangeEventHandler } from "react";
import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import { SongRequestRecordList } from "~/components/SongRequest/list";
import { AdminTrackModal } from "~/components/TrackModal/admin";
import { playlistEditorStore } from "~/components/PlaylistEditor/store";
import SelectTrackButton from "./SelectTrack";
import RandomTrackButton from "./Random";
import { toast } from "react-toastify";
import ConfirmPlaylistModal from "./Modal";
import { getStatusFromDate } from "~/utils/pm-station/songrequests/date";

const ViewTrackModal = memo(function ViewTrackModal() {
  const track = playlistEditorStore((state) => state.track);
  const onRemove = useCallback((track: SongRequestRecord) => {
    playlistEditorStore.getState().remove(track.id);
    const status = getStatusFromDate(track.lastPlayedAt);
    toast(
      <>
        <b>
          {status === "rejected" ? "ปฎิเสธและ" : ""}ลบเพลง {track.name}{" "}
          ออกจากรายการเพลงแล้ว
        </b>
        {status !== "rejected" && (
          <button
            className="underline text-sm text-gray-300 self-start"
            onClick={() => {
              playlistEditorStore.getState().addId(track.id);
              playlistEditorStore.getState().pushData([track]);
            }}
          >
            ยกเลิก
          </button>
        )}
      </>,
      {
        type: "info",
        pauseOnFocusLoss: false,
      }
    );
  }, []);

  const setTrack = useCallback((track?: SongRequestRecord) => {
    playlistEditorStore.setState({ track });
  }, []);

  return (
    <AdminTrackModal
      onClose={() => setTrack(undefined)}
      type="removeFromPlaylist"
      onAction={onRemove}
      track={track}
    />
  );
});

export default function PlaylistEditor() {
  const data = playlistEditorStore((state) => state.data);
  const totalDuration = playlistEditorStore((state) => state.duration);

  const setCount: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    playlistEditorStore.setState({ count: e.target.valueAsNumber });
  }, []);

  const setTrack = useCallback((track?: SongRequestRecord) => {
    playlistEditorStore.setState({ track });
  }, []);

  const countRef = useRef<HTMLInputElement | null>();
  useEffect(() => {
    return playlistEditorStore.subscribe(
      (state) => state.count,
      (count) => {
        if (!countRef.current) return;
        countRef.current.value = count.toString();
      },
      {
        fireImmediately: true,
      }
    );
  }, []);
  return (
    <>
      <ViewTrackModal />
      <ConfirmPlaylistModal />
      <div className="flex flex-row flex-wrap gap-5 sm:gap-6 items-center">
        <div className="flex flex-row items-center gap-4">
          <div className="flex flex-col gap-1">
            <b>จำนวนเพลงในรายการที่ต้องการ:</b>
            <span className="text-xs">
              ขณะนี้มีอยู่ {data.length} ระยะเวลาทั้งหมด {totalDuration}
            </span>
          </div>
          <input
            id="trackCount"
            type="number"
            min={1}
            className="pm-station-input w-16"
            ref={(ref) => (countRef.current = ref)}
            onChange={setCount}
          />
        </div>
        <SelectTrackButton />
        <RandomTrackButton />
      </div>
      {data.length > 0 && (
        <SongRequestRecordList data={data} onItemClick={setTrack} />
      )}
    </>
  );
}
