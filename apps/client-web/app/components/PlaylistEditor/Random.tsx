import { useCallback, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useFirebase } from "~/utils/firebase";
import RandomTrackSelector from "~/utils/pm-station/songrequests/random.client";
import { playlistEditorStore } from "./store";

export default function RandomTrackButton() {
  const { db } = useFirebase();
  const random = useRef<RandomTrackSelector>();
  useEffect(() => {
    random.current = new RandomTrackSelector(db);
  }, [db]);

  const randomSong = useCallback(() => {
    const { count, addedIds, addId, pushData } = playlistEditorStore.getState();
    const tracksLeft = count - addedIds.size;
    if (tracksLeft > 0) {
      random.current?.getRandomTracks(tracksLeft).then((data) => {
        const filteredData = data.filter(({ id }) => {
          if (addedIds.has(id)) return false;
          addId(id);
          return true;
        });
        pushData(filteredData);
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
  return (
    <button
      className="pm-station-btn text-sm bg-violet-500 hover:bg-violet-600 text-white rounded"
      onClick={randomSong}
    >
      สุ่มเพลง
    </button>
  );
}