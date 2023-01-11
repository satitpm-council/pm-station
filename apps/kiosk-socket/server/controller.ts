import { Socket } from ".";

export const setupControllerEvents = (socket: Socket) => {
  // Forward events from controller to the projector
  socket.on("play", (track) => {
    socket.to("projector").emit("play", track);
  });
  socket.on("stop", () => {
    socket.to("projector").emit("stop");
  });
};
