"use server";

import pusher from "../pusher.server";
import { Channels } from "../types";

type ControllerSendEvents = Channels["cache-projector"];

export const sendPlayEvent = async ({
  track,
  trackEndTime,
}: ControllerSendEvents["play"]) => {
  await pusher.trigger("cache-projector", "play", {
    track,
    trackEndTime,
  });
};

export const sendStopEvent = async () => {
  await pusher.trigger("cache-projector", "stop", null);
};
