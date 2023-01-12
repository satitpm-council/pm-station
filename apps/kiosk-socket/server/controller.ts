import { Server, Socket } from ".";

export const setupControllerEvents = (socket: Socket, io: Server) => {
  // Forward events from controller to the projector
  socket.on("play", (track) => {
    console.log("Controller requested play:", track);
    console.log(Array.from(socket.rooms.values()));
    io.to("display").emit("play", track);
  });
  socket.on("stop", () => {
    io.to("display").emit("stop");
  });
};
