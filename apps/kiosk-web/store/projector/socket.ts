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
  socket.on("connect", () => {
    socket.on("play", (track) =>
      projectorStore.setState({ currentTrack: track })
    );
    socket.on("stop", () =>
      projectorStore.setState({ currentTrack: undefined })
    );
  });
};
