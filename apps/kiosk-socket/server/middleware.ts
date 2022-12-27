import { ServerSocket } from ".";
import { AuthParam } from "../types";
import { getTodayPlaylist, verifyIdToken } from "./firebase";

type Middleware = Parameters<ServerSocket["use"]>["0"];
type MiddlewareParams = Parameters<Middleware>;

export const authMiddleware = async (
  io: ServerSocket,
  socket: MiddlewareParams["0"]
): Promise<null> => {
  const auth = (socket.handshake.auth || {}) as AuthParam;
  if (auth.type === "controller") {
    if (!auth.token) throw new Error("Unauthorized.");
    const user = await verifyIdToken(auth.token, true);
    socket.data.user = user;
    socket.data.type = auth.type;

    const controllerClients = (await io.fetchSockets()).filter(
      (c) => c.data.type === "controller"
    );
    if (controllerClients.length > 0) {
      if (!auth.forceDisconnect) {
        throw new Error(
          "More than 1 controller client are currenly connected. Requires force disconnect."
        );
      }
      controllerClients.forEach((socket) => {
        socket.disconnect(true);
      });
    }
    socket.data.playlist = await getTodayPlaylist();
  }
  return null;
};
