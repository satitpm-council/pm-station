import { PageHeader } from "~/components/Header";
import { withTitle } from "~/utils/pm-station/client";
import RandomTrackSelector from "~/utils/pm-station/songrequests/random.client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEventHandler } from "react";
import { useFirebase } from "~/utils/firebase";
import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import type { ChannelMessage } from "~/utils/pm-station/playlists/channel";
import { ChannelName } from "~/utils/pm-station/playlists/channel";
import { toast } from "react-toastify";
import { SongRequestRecordList } from "~/components/SongRequest/list";
import { AdminTrackModal } from "~/components/TrackModal/admin";
import dayjs from "~/utils/dayjs";

export const meta = withTitle("เพิ่มรายการเพลง");

export default function AddPlaylist() {
  const count = useRef(8);
  const addedIds = useRef<Set<string>>(new Set());
  const channel = useRef<BroadcastChannel>();
  const [track, setTrack] = useState<SongRequestRecord>();
  const [data, setData] = useState<SongRequestRecord[]>([]);
  const { db } = useFirebase();
  const random = useRef<RandomTrackSelector>();
  useEffect(() => {
    random.current = new RandomTrackSelector(db);
  }, [db]);

  useEffect(() => {
    channel.current = new BroadcastChannel(ChannelName);
    const messageHandler = (event: MessageEvent) => {
      const data: ChannelMessage = event.data;
      console.log(data);
      if (data.method === "add" && !addedIds.current.has(data.track.id)) {
        addedIds.current.add(data.track.id);
        setData((d) => [...d, data.track]);
      }
    };
    channel.current.addEventListener("message", messageHandler);
    return () => {
      channel.current?.removeEventListener("message", messageHandler);
      channel.current?.close();
    };
  }, []);
  const openSongSelector = useCallback(() => {
    window.open(
      "/pm-station/app/songrequests/editor/playlists/selectSong",
      "SelectSongPopup",
      "width=635,height=600"
    );
  }, []);

  const randomSong = useCallback(() => {
    const tracksLeft = count.current - addedIds.current.size;
    if (tracksLeft > 0) {
      random.current?.getRandomTracks(tracksLeft).then((data) => {
        const filteredData = data.filter(({ id }) => {
          if (addedIds.current.has(id)) return false;
          addedIds.current.add(id);
          return true;
        });
        setData((d) => [...d, ...filteredData]);
      });
    } else {
      toast(
        <>
          <b>ไม่สามารถสุ่มเพลงได้</b>
          <span>จำนวนเพลงคงเหลือไม่เพียงพอ</span>
        </>,
        {
          type: "error",
        }
      );
    }
  }, []);

  const setCount: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    count.current = e.target.valueAsNumber;
  }, []);

  const onRemove = useCallback((track: SongRequestRecord) => {
    addedIds.current.delete(track.id);
    setData((d) => d.filter(({ id }) => id !== track.id));
  }, []);

  const totalDuration = useMemo(() => {
    const total = data.reduce(
      (total, { duration_ms }) => total + duration_ms,
      0
    );
    return dayjs.duration(total).format("mm:ss");
  }, [data]);

  return (
    <>
      <AdminTrackModal
        onClose={() => setTrack(undefined)}
        type="removeFromPlaylist"
        onAction={onRemove}
        track={track}
      />
      <PageHeader title={"เพิ่มรายการเพลง"}>
        เลือกเพลงสำหรับเพิ่มลงในรายการ
      </PageHeader>
      <div className="flex flex-row flex-wrap gap-6 items-center">
        <b className="text-lg font-bold">{totalDuration}</b>
        <div className="flex flex-row items-center gap-4">
          <div className="flex flex-col gap-1">
            <b>จำนวนเพลงในรายการที่ต้องการ:</b>
            <span className="text-xs">ขณะนี้มีอยู่ {data.length}</span>
          </div>
          <input
            type="number"
            className="pm-station-input w-12"
            defaultValue={count.current}
            onChange={setCount}
          />
        </div>
        <button
          className="pm-station-btn text-sm bg-blue-500 hover:bg-blue-600 text-white focus:outline-none"
          onClick={openSongSelector}
        >
          เปิดหน้าเลือกเพลง
        </button>
        <button
          className="pm-station-btn text-sm bg-violet-500 hover:bg-violet-600 text-white rounded"
          onClick={randomSong}
        >
          สุ่มเพลง
        </button>
      </div>
      {data.length > 0 && (
        <SongRequestRecordList data={data} onItemClick={setTrack} />
      )}
    </>
  );
}
