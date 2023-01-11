import { AuthParam } from "kiosk-socket/types";
import { io } from "socket.io-client";
import { ClientSocket, controllerStore } from "./store";

export const initializeSocket = (
  endpoint: string,
  initAuthParam: AuthParam
) => {
  const socket: ClientSocket = io(endpoint, {
    auth: initAuthParam,
  });

  controllerStore.setState({ socket });
  socket.on("connect", () => {
    controllerStore.setState({ isConnected: true });
  });
  socket.on("connect_error", (error) => {
    controllerStore.setState({ isConnected: false });
  });
  socket.on("disconnect", (reason) => {
    controllerStore.setState({ isConnected: false });
  });
};
