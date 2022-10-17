import { useCallback } from "react";

import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";

const RemoveTrackFromPlaylist = ({
    track,
    onRemove,
}: {
  track?: SongRequestRecord;
  onRemove: (track: SongRequestRecord) => void;
}) => {
  const remove = useCallback(() => {
    if (!track) return;
    onRemove(track);
  }, [onRemove,  track]);
  return (
    <button
      onClick={remove}
      className={`text-sm pm-station-btn bg-red-300 hover:bg-red-400 text-gray-900 pm-station-focus-ring focus:ring-red-300`}
    >
      ลบออกจากรายการ
    </button>
  );
};

export default RemoveTrackFromPlaylist
