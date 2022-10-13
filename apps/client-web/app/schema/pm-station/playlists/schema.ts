import { z } from "zod";
import { docRef, preprocessDate } from "~/schema/utils";

const PlaylistRecord = z.object({
  queuedDate: z.preprocess(preprocessDate, z.date()),
  status: z.enum(["played", "queued", "playing"]),
  target: z.preprocess(docRef, z.string()),
  totalTracks: z.number(),
});

export { PlaylistRecord };
