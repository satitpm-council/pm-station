"use server";

import { CHANNELS } from "../constants";
import pusher from "../pusher.server";
import { TrackResponse } from "@station/shared/schema/types";

export type ControllerSendEvents = {
  play: {
    track: TrackResponse;
    trackEndTime: number;
  };
  stop: undefined;
};

export const sendPlayEvent = async ({
  track,
  trackEndTime,
}: ControllerSendEvents["play"]) => {
  await pusher.trigger(CHANNELS.PROJECTOR, "play", {
    track,
    trackEndTime,
  });
};

export const sendStopEvent = async () => {
  await pusher.trigger(CHANNELS.PROJECTOR, "stop", null);
};
