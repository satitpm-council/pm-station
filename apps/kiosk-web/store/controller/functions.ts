import { controllerStore, MediaStatus, Track } from "./store";

export const toggleShowBottomSheet = () => {
  controllerStore.setState((s) => ({
    ...s,
    showBottomSheet: !s.showBottomSheet,
  }));
};

export const addTrack = (track: Track) => {
  controllerStore.setState((s) => ({
    ...s,
    queue: new Set<Track>(s.queue).add(track),
  }));
};

export const removeTrack = (track: Track) => {
  controllerStore.setState((s) => {
    const queue = new Set<Track>(s.queue);
    queue.delete(track);
    return {
      ...s,
      queue,
    };
  });
};

export const playTrack = (track: Track) => {
  controllerStore.setState((s) => {
    const queue = Array.from(s.queue.values());
    // get the index of the track in the queue
    const index = queue.findIndex((t) => t.id === track.id);
    // remove any previous tracks from the queue
    queue.splice(0, index);

    return {
      ...s,
      queue: new Set<Track>(queue),
      playingTrack: track,
    };
  });
};

export const stopTrack = () => {
  const { socket } = controllerStore.getState();
  if (socket) {
    socket.emit("stop");
  }
  controllerStore.setState((s) => ({
    ...s,
    mediaStatus: null,
    playingTrack: undefined,
  }));
};

export const setMediaStatus = (mediaStatus: MediaStatus) => {
  controllerStore.setState((s) => ({
    ...s,
    mediaStatus,
  }));
};
