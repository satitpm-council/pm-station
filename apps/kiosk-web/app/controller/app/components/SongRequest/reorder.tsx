import { Reorder } from "framer-motion";
import { useCallback } from "react";
import { controllerStore, Track } from "../../store";
import { ReorderItem } from "./reorder-item";

export default function SongRequestReorderList() {
  const queue = controllerStore((state) => Array.from(state.queue.values()));
  const setQueue = useCallback((tracks: Track[]) => {
    controllerStore.setState({
      queue: new Set(tracks),
    });
  }, []);
  return (
    <Reorder.Group
      className="songrequest-container"
      axis="y"
      onReorder={setQueue}
      values={queue}
    >
      {queue.map((track) => (
        <ReorderItem key={track.id} track={track} onItemClick={console.log} />
      ))}
    </Reorder.Group>
  );
}
