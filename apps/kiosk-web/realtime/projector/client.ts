import { projectorStore } from "kiosk-web/store/projector";
import { CHANNELS } from "../constants";
import pusher from "../pusher.client";

export const initialize = () => {
  pusher.connect();
  const channel = pusher.subscribe(CHANNELS.PROJECTOR);
  channel.bind("play", ({ track, trackEndTime }) => {
    const timeLeft = trackEndTime - new Date().valueOf();
    if (timeLeft < 0) return;
    const durationTimeout = setTimeout(() => {
      projectorStore.setState({ currentTrack: undefined });
    }, timeLeft);
    projectorStore.setState((state) => {
      if (state.durationTimeout) {
        clearTimeout(state.durationTimeout);
      }
      return { currentTrack: track, durationTimeout };
    });
  });
  channel.bind("stop", () => {
    projectorStore.setState((s) => {
      if (s.durationTimeout) {
        clearTimeout(s.durationTimeout);
      }
      return { ...s, durationTimeout: undefined, currentTrack: undefined };
    });
  });
};

export const cleanup = () => {
  const { durationTimeout } = projectorStore.getState();
  if (durationTimeout) {
    clearTimeout(durationTimeout);
  }
  pusher.unbind_all();
  pusher.disconnect();
};
