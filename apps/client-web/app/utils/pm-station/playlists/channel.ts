import type { SongRequestRecord } from "@station/shared/schema/types";

export const ChannelName = "station-playlist";

export type AddTrackMessage = {
  method: "add";
  track: SongRequestRecord;
};

export type ChannelMessage = AddTrackMessage;
