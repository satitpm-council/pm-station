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

export const playTrack = (track: Track) => {
  controllerStore.setState((s) => ({
    ...s,
    playingTrack: track,
  }));
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
