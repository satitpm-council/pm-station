import { Server, Socket } from "socket.io";

import { Server as IOServer, Socket as IOSocket } from "../types";
import { SocketData } from "../types/socket/server";
import { setupControllerEvents } from "./controller";
import DataStore from "./datastore";
import type { ServerStore } from "../types";
import { authMiddleware } from "./middleware";
import dayjs from "dayjs";
import { setupDisplayEvents } from "./display";

const allowedOrigins = [
  "https://pm-station-kiosk.vercel.app",
  "https://coolkidssatit.fly.dev",
];

const initializeSocket = (server: any): Server => {
  const io: IOServer = new Server(server, {
    cors: {
      ...(process.env.NODE_ENV === "production"
        ? {
            origin: (origin, callback) => {
              if (origin && allowedOrigins.includes(origin)) {
                callback(null, true);
              } else {
                callback(new Error("Not allowed by CORS"));
              }
            },
          }
        : {
            // Allow all origins in development
            origin: "*",
          }),
      allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
      methods: ["GET", "POST", "OPTIONS", "HEAD"],
      credentials: true,
    },
  });
  let store: DataStore<ServerStore> | undefined;
  io.use((socket, next) => {
    authMiddleware(io, socket)
      .then(() => next())
      .catch((err) => {
        console.error(err);
        next(err);
      });
  });

  io.on("connection", async (socket) => {
    if (!store) {
      store = new DataStore({
        expiration: dayjs()
          .add(1, "day")
          .hour(0)
          .minute(0)
          .second(0)
          .millisecond(0)
          .unix(),
      });
    }
    const data = socket.data as SocketData;
    console.log(data);
    socket.join(data.type);
    if (process.env.NODE_ENV === "development") {
      socket.onAny((...args) => console.log("Socket Received:", args));
      socket.onAnyOutgoing((...args) => console.log("Socket Sent:", args));
    }
    if (data.type === "controller") {
      setupControllerEvents(socket, io, store);
    }

    if (data.type === "display") {
      setupDisplayEvents(socket, io, store);
    }

    /* socket.on("disconnect", async () => {
      const pendingSockets = (await io.fetchSockets()).filter(
        (v) => v.data.type === "controller"
      );
      if (pendingSockets.length === 0) {
        // destroy the current datastore
        store = undefined;
      }
    });*/
  });
  return io;
};

export default initializeSocket;
