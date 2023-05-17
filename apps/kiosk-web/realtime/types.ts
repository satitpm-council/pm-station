import { ChannelsMap } from "pusher-js";
import { TrackResponse } from "@station/shared/schema/types";

export interface Channels extends ChannelsMap {
  "cache-projector": {
    play: {
      track: TrackResponse;
      trackEndTime: number;
    };
    stop: null;
  };
}
