import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import {
  ClientToServerEvents,
  ServerToClientEvents,
  ServerSocketData,
} from "../types/socket-interfaces";

import { authMiddleware } from "./middleware";

export type ServerSocket = Server<
  ServerToClientEvents,
  ClientToServerEvents,
  DefaultEventsMap,
  ServerSocketData
>;

const initializeSocket = (server: any): ServerSocket => {
  const io: ServerSocket = new Server(server, {
    ...(process.env.NODE_ENV !== "production"
      ? {
          cors: {
            origin: "*",
          },
        }
      : {}),
  });

  io.use((socket, next) => {
    authMiddleware(io, socket)
      .then(() => next())
      .catch((err) => {
        console.error(err);
        next(err);
      });
  });

  io.on("connection", async (socket) => {
    const data = socket.data as ServerSocketData;
    if (!data.playlist) return;
    console.log(data.user);
    socket.join(data.type);
  });
  return io;
};

export default initializeSocket;
