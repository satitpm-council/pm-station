import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ClientToServerEvents, SocketData } from "./socket/server";
import { Server as IOServer, Socket as IOSocket } from "socket.io";
import { ServerStore } from "./store";
import DataStore from "../server/datastore";
import { ControllerSendEvents } from "./socket/controller";

export type EventsSetupFunction = (
  socket: Socket,
  io: Server,
  store: DataStore<ServerStore>
) => Promise<void> | void;

export type Server = IOServer<
  ClientToServerEvents,
  DefaultEventsMap,
  DefaultEventsMap,
  SocketData
>;

export type Socket = IOSocket<
  ClientToServerEvents,
  ControllerSendEvents,
  DefaultEventsMap,
  SocketData
>;
