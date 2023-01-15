import { AuthParam } from "kiosk-socket/types";
import { io } from "socket.io-client";
import { ClientSocket, projectorStore } from "./store";

export const initializeSocket = (endpoint: string) => {
  const auth: AuthParam = {
    type: "display",
  };
  const socket: ClientSocket = io(endpoint, {
    auth,
  });

  projectorStore.setState({ socket });
  socket.onAny((...args) => console.log("Socket Received:", args));
  socket.on("connect", () => {
    console.log("Connected to socket server.");
  });
  socket.on("play", (track) => {
    const durationTimeout = setTimeout(() => {
      projectorStore.setState({ currentTrack: undefined });
    }, track.duration_ms);
    projectorStore.setState({ currentTrack: track, durationTimeout });
  });
  socket.on("stop", () => {
    projectorStore.setState((s) => {
      if (s.durationTimeout) {
        clearTimeout(s.durationTimeout);
      }
      return { ...s, durationTimeout: undefined, currentTrack: undefined };
    });
  });
};

export const cleanupSocket = () => {
  const { socket, durationTimeout } = projectorStore.getState();
  if (durationTimeout) {
    clearTimeout(durationTimeout);
  }
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
  }
};
