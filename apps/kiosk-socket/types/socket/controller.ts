import { TrackResponse } from "@station/shared/schema/types";

export type ControllerSendEvents = {
  play: (track: TrackResponse, trackEndTime: number) => void;
  stop: () => void;
};
