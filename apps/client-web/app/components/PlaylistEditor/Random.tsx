import { useCallback, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useFirebase } from "@station/client/firebase";
import RandomTrackSelector from "~/utils/pm-station/songrequests/random.client";
import { playlistEditorStore } from "./store";

export default function RandomTrackButton() {
  const { db } = useFirebase();
  const isLoading = useRef(false);
  const random = useRef<RandomTrackSelector>();
  useEffect(() => {
    random.current = new RandomTrackSelector(db);
  }, [db]);

  const randomSong = useCallback(() => {
    if (isLoading.current) return;
    const { count, addedIds, addId, pushData } = playlistEditorStore.getState();
    const tracksLeft = count - addedIds.size;
    if (tracksLeft > 0) {
      isLoading.current = true;
      random.current?.getRandomTracks(tracksLeft).then((data) => {
        const filteredData = data.filter(({ id }) => {
          if (addedIds.has(id)) return false;
          addId(id);
          return true;
        });
        pushData(filteredData);
        isLoading.current = false;
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
