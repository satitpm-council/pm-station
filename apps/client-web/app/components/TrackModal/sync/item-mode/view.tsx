import { MusicInfoComponent } from "../info";
import type { MusicInfo } from "~/utils/pm-station/ytmusic/types";

export const ViewMusic = ({ result }: { result?: MusicInfo | null }) => {
  return (
    <>
      <b className="font-medium">ผลการค้นหา:</b>
      {result && <MusicInfoComponent info={result} />}
    </>
  );
};
