import { PageHeader } from "~/components/Header";
import { withTitle } from "~/utils/pm-station/client";
import dayjs from "~/utils/dayjs";
import RandomTrackSelector from "~/utils/pm-station/songrequests/random.client";
import { useEffect, useRef, useState } from "react";
import { useFirebase } from "~/utils/firebase";
import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import TrackThumbnail from "~/components/TrackThumbnail";
import type { ChannelMessage } from "~/utils/pm-station/playlists/channel";
import { ChannelName } from "~/utils/pm-station/playlists/channel";

export const meta = withTitle("เพิ่มรายการเพลง");

export default function AddPlaylists() {
  const channel = useRef<BroadcastChannel>();
  const [data, setData] = useState<SongRequestRecord[]>();
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
      if (data.method === "add") {
        setData((d) => [...(d ?? []), data.track]);
      }
    };
    channel.current.addEventListener("message", messageHandler);
    return () => {
      channel.current?.removeEventListener("message", messageHandler);
      channel.current?.close();
    };
  }, []);
  return (
    <>
      <PageHeader title={"เพิ่มรายการเพลง"}>
        เลือกเพลงสำหรับเพิ่มลงในรายการ
      </PageHeader>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => random.current?.getRandomTracks(8).then(setData)}
      >
        Random
      </button>
      <button
        onClick={() =>
          window.open(
            "/pm-station/app/songrequests/editor/playlists/selectSong",
            "SelectSongPopup",
            "width=635,height=600"
          )
        }
      >
        Open
      </button>
      {data && (
        <div className="flex flex-row flex-wrap gap-4">
          {data.map((track) => (
            <button
              key={track?.id}
              className="w-full md:w-[unset] md:flex items-center justify-center bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 min-w-0 min-h-0 transition-colors"
            >
              <div className="items-center md:items-baseline px-4 py-3 md:p-6 flex flex-row md:flex-col gap-4 min-w-0 min-h-0 md:w-[200px] xl:w-[250px]">
                <TrackThumbnail
                  track={track}
                  className={{
                    wrapper: "basis-1/4 min-w-[85px] relative",
                    image: "w-full h-auto rounded-lg",
                    badge:
                      "bg-yellow-400 text-gray-900 font-medium px-4 py-2 bottom-1 left-1 md:bottom-2 md:left-2",
                  }}
                  badge={{
                    title: `จำนวนผู้ส่งคำขอ ${track.submissionCount} คน`,
                  }}
                >
                  {track.submissionCount !== 1 && track.submissionCount}
                </TrackThumbnail>
                <div className="basis-3/4 text-gray-300 max-w-full text-sm flex flex-grow text-left flex-col items-start min-w-0 min-h-0 truncate">
                  <b className="text-white text-base truncate min-w-0 w-full mb-1">
                    {track.explicit && (
                      <span
                        title="Explict"
                        className="text-sm bg-gray-500 text-white py-1 px-2 inline mr-2"
                      >
                        E
                      </span>
                    )}
                    {track.name}
                  </b>

                  <span className="truncate min-w-0 w-full">
                    {track.artists.join("/")}
                  </span>
                  <span>
                    {dayjs.duration(track.duration_ms).format("mm:ss")}
                  </span>
                  <span>
                    ส่งคำขอล่าสุดเมื่อวันที่{" "}
                    {dayjs(track.lastUpdatedAt).format("LL HH:mm น.")}
                  </span>
                  {track.lastPlayedAt && track.lastPlayedAt.valueOf() > 0 && (
                    <span>
                      เล่นล่าสุดเมื่อวันที่{" "}
                      {dayjs(track.lastPlayedAt).format("LL")}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
