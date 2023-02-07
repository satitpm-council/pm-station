// custom dev server

import { createServer } from "http";
import initializeSocket from ".";

const httpServer = createServer();
const socket = initializeSocket(httpServer);

const port = process.env.PORT || 3001;
httpServer.listen(port, () => {
  console.log(`Starting socket server on PORT ${port}`);
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
