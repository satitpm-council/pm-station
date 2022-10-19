import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import { useCallback, useEffect, useRef } from "react";
import type { AddTrackMessage } from "~/utils/pm-station/playlists/channel";
import { ChannelName } from "~/utils/pm-station/playlists/channel";
import { toast } from "react-toastify";
import { captureException } from "@sentry/remix";

const ToastId = "playlist-track-added";
const AddTrackToPlaylist = ({
  track,
  onClose,
}: {
  track?: SongRequestRecord;
  onClose: () => void;
}) => {
  const channel = useRef<BroadcastChannel>();

  useEffect(() => {
    channel.current = new BroadcastChannel(ChannelName);
    return () => channel.current?.close();
  }, []);

  const select = useCallback(() => {
    if (!track) return;
    const message: AddTrackMessage = {
      method: "add",
      track: { ...track, __snapshot: undefined } as SongRequestRecord,
    };
    try {
      channel.current?.postMessage(message);
      onClose();
      setTimeout(() => {
        toast(<b>เพิ่มเพลงลงในรายการแล้ว</b>, {
          type: "success",
          pauseOnFocusLoss: false,
          toastId: ToastId,
        });
      }, 200);
    } catch (err) {
      console.error(err);
      captureException(err);
    }
  }, [track, onClose]);

  return (
    <button
      title="เลือกคำขอเพลงนี้"
      className="bg-green-500 text-white px-5 py-3 rounded-lg hover:bg-green-600 focus:outline-none"
      onClick={() => select()}
    >
      เลือกเพลงนี้
    </button>
  );
};

export default AddTrackToPlaylist;
