import { ServerSocket } from ".";
import { AuthParam } from "../types";
import type { ExtendedError } from "socket.io/dist/namespace";
import { verifyIdToken } from "./firebase";

type Middleware = Parameters<ServerSocket["use"]>["0"];
type MiddlewareParams = Parameters<Middleware>;

const getTodayPlaylist = () => {};

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
  }
  // Get the current playlist
  return null;
};
