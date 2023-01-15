import { TrackResponse } from "@station/shared/schema";
import { TrackResponse as T } from "@station/shared/schema/types";
import { BroadcastOperator } from "socket.io";
import { EventsSetupFunction } from "../types";
import { ProjectorRecieveEvents } from "../types/socket/projector";
import { SocketData } from "../types/socket/server";
import { Options } from "./datastore";

const TrackCacheOptions: Partial<Options<T>> = {
  validator: (value) => TrackResponse.parse(value),
};

export const setupControllerEvents: EventsSetupFunction = (
  socket,
  io,
  store
) => {
  const display: BroadcastOperator<ProjectorRecieveEvents, SocketData> =
    io.to("display");
  // Forward events from controller to the projector
  socket.on("play", async (track, trackEndTime) => {
    console.log("Controller requested play:", track);
    try {
      await store.set("currentTrack", track, {
        expiration: trackEndTime,
        ...TrackCacheOptions,
      });
    } catch {}

    display.emit("play", track, trackEndTime);
  });
  socket.on("stop", async () => {
    try {
      await store.delete("currentTrack");
    } catch {}
    display.emit("stop");
  });
};
