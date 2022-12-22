import { useCallback, useState } from "react";
import axios from "~/utils/axios";
import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import type { ModalState } from "~/components/Modal";
import Modal from "~/components/Modal";

import { SyncMusicItem } from "./item";
import type { SearchActionResponse } from "~/utils/pm-station/api-types";
import { SubmitButton } from "~/components/SubmitButton";

export const SyncMusicModal = ({
  tracks,
  ...props
}: ModalState & { tracks: SongRequestRecord[] }) => {
  const closeModal = useCallback(() => {
    props.closeModal();
  }, [props]);

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchActionResponse["data"]>();
  const searchMusic = useCallback(async () => {
    if (tracks.length > 0) {
      const trackQueries = tracks.map((v) => `${v.artists[0]} ${v.name}`);
      try {
        setIsLoading(true);
        const { data } = await axios.post<SearchActionResponse>(
          "/pm-station/app/songrequests/stream/search",
          { q: trackQueries }
        );
        setResults(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [tracks]);
  return (
    <Modal canClose={!isLoading} isOpen={props.isOpen} closeModal={closeModal}>
      <div className="flex flex-col gap-2 w-full">
        <h1 className="font-bold text-2xl">Auto Sync</h1>
        <p className="text-sm text-gray-200">
          ค้นหารายการใน YouTube Music เพื่อซิงก์รายการเพลงจาก Spotify
          สำหรับเปิดในระบบโดยอัตโนมัติ
        </p>
        <div className="flex flex-col justify-center py-4">
          <SubmitButton
            disabled={results !== undefined}
            onClick={searchMusic}
            loading={isLoading}
          >
            ค้นหารายการ
          </SubmitButton>
        </div>
        <div className="flex flex-wrap flex-col text-left gap-4">
          {tracks?.map((track, i) => (
            <SyncMusicItem
              result={results ? results[i] : null}
              key={track.id}
              track={track}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
};
