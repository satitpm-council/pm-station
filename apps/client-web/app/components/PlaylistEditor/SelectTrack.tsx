import { useCallback, useEffect, useRef } from "react";
import type { ChannelMessage } from "~/utils/pm-station/playlists/channel";
import { ChannelName } from "~/utils/pm-station/playlists/channel";
import { playlistEditorStore } from "./store";

export default function SelectTrackButton() {
  const windowRef = useRef<Window | null>();
  const channel = useRef<BroadcastChannel>();
  useEffect(() => {
    channel.current = new BroadcastChannel(ChannelName);
    const messageHandler = (event: MessageEvent) => {
      const data: ChannelMessage = event.data;
      console.log(data);
      const { addedIds, addId, pushData } = playlistEditorStore.getState();
      if (data.method === "add" && !addedIds.has(data.track.id)) {
        addId(data.track.id);
        pushData([data.track]);
      }
    };
    channel.current.addEventListener("message", messageHandler);
    return () => {
      channel.current?.removeEventListener("message", messageHandler);
      channel.current?.close();
    };
  }, []);

  const openSongSelector = useCallback(() => {
    windowRef.current = window.open(
      "/pm-station/app/songrequests/playlists/selectSong",
      "SelectSongPopup",
      "width=635,height=600"
    );
  }, []);

  useEffect(() => {
    return () => windowRef.current?.close();
  }, []);
  return (
    <button
      className="pm-station-btn text-sm bg-blue-500 hover:bg-blue-600 text-white focus:outline-none"
      onClick={openSongSelector}
    >
      เปิดหน้าเลือกเพลง
    </button>
  );
}
