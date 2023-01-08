// custom dev server

import { createServer } from "http";
import initializeSocket from ".";

const httpServer = createServer();
const socket = initializeSocket(httpServer);

httpServer.listen(3001, () => {
  console.log("Starting socket server on PORT 3001");
});

process.on("SIGINT", () => {
  console.log("Terminate socket server");
  socket.close(() => {
    process.exit();
  });
});

process.on("SIGTERM", () => {
  console.log("Terminate socket server");
  socket.close(() => {
    process.exit();
  });
});

process.once("SIGUSR2", function () {
  socket.close(() => {
    process.kill(process.pid, "SIGUSR2");
  });
});
