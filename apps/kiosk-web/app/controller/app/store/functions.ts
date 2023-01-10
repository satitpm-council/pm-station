import { controllerStore, Track } from "./store";

export const toggleShowBottomSheet = () => {
  controllerStore.setState((s) => ({
    ...s,
    showBottomSheet: !s.showBottomSheet,
  }));
};

export const playTrack = (track: Track) => {
  controllerStore.setState((s) => ({
    ...s,
    playingTrack: track,
  }));
};
