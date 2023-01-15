import { EventsSetupFunction } from "../types";

export const setupDisplayEvents: EventsSetupFunction = async (
  socket,
  io,
  store
) => {
  // get the current track if exists
  try {
    const currentTrack = await store.get("currentTrack");
    if (currentTrack) {
      // if the current track exists, send it to the display
      socket.emit("play", currentTrack.value, currentTrack.expiration);
    }
  } catch (err) {
    console.error(err);
  }
};
