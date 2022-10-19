import { z } from "zod";
import { preprocessDate } from "~/schema/utils";
import { isString } from "~/utils/guards";

const PlaylistRecord = z.object({
  queuedDate: z.preprocess(preprocessDate, z.date()),
  status: z.enum(["played", "queued", "playing"]),
  target: z.string(),
  totalTracks: z.number(),
});

const SetPlaylistAction = z.object({
  target: z.string(),
  queuedDate: z.preprocess((arg) => {
    if (isString(arg) && !isNaN(new Date(arg).valueOf())) return arg;
  }, z.string()),
  playlistId: z.string().optional(),
  tracks: z.array(z.string()),
});

export { PlaylistRecord, SetPlaylistAction };
