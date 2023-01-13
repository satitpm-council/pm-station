import { NextApiHandler } from "next";
import { Server as SocketServer } from "socket.io";
import initalizeSocket from "kiosk-socket/server";

declare module "net" {
  interface Socket {
    server: {
      io?: SocketServer;
    };
  }
}

// injects the socket.io into Next.js HTTP server using the 'req.socket.server' property.
const socketHandler: NextApiHandler = async (req, res) => {
  if (req.socket.server.io) {
    // socket already initialized
    res.end();
    return;
  }
  req.socket.server.io = initalizeSocket(req.socket.server);
  setTimeout(() => {
    res.end();
  }, 200);
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default socketHandler;
