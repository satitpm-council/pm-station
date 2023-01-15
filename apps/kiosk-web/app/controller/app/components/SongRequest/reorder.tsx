import { Reorder } from "framer-motion";
import { useCallback } from "react";
import { controllerStore, playTrack, Track } from "kiosk-web/store/controller";
import { ReorderItem } from "./reorder-item";

export default function SongRequestReorderList() {
  const queue = controllerStore((state) => Array.from(state.queue.values()));
  const setQueue = useCallback((tracks: Track[]) => {
    // The first track must be the current playing track
    const { playingTrack } = controllerStore.getState();
    const reorderedTracks = playingTrack
      ? tracks.sort((a, b) => {
          if (a.id === playingTrack.id) return -1;
          if (b.id === playingTrack.id) return 1;
          return 0;
        })
      : tracks;

    controllerStore.setState({
      queue: new Set(reorderedTracks),
    });
  }, []);

  const onItemClick = useCallback((track: Track) => {
    playTrack(track);
  }, []);
  return (
    <Reorder.Group
      className="songrequest-container divide-y divide-zinc-700"
      axis="y"
      onReorder={setQueue}
      values={queue}
    >
      {queue.map((track) => (
        <ReorderItem key={track.id} track={track} onItemClick={onItemClick} />
      ))}
    </Reorder.Group>
  );
}
