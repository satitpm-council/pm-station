import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";

export const ChannelName = "station-playlist";

export type AddTrackMessage = {
  method: "add";
  track: SongRequestRecord;
};

export type ChannelMessage = AddTrackMessage;
