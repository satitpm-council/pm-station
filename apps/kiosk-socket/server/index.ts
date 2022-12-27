import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import {
  ClientToServerEvents,
  ServerToClientEvents,
  ServerSocketData,
} from "../types/socket-interfaces";

import { AuthParam } from "../types";
import { authMiddleware } from "./middleware";

const io = new Server<
  ServerToClientEvents,
  ClientToServerEvents,
  DefaultEventsMap,
  ServerSocketData
>();

export type ServerSocket = typeof io;

io.use((socket, next) => {
  authMiddleware(io, socket)
    .then(() => next())
    .catch((err) => next(err));
});

io.on("connection", async (socket) => {
  const data = socket.data as ServerSocketData;
  if (!data.playlist) return;
  if (data.type === "controller") {
    io.in("controller").disconnectSockets(true);
  }
  socket.join(data.type);
});

export default io;
