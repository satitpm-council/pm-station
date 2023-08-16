import type { z } from "zod";
import type * as Schema from "./schema";

type SongRequestRecord = z.infer<(typeof Schema)["SongRequestRecord"]>;
type SongRequestSubmission = z.infer<(typeof Schema)["SongRequestSubmission"]>;
type SongRequestSummary = z.infer<(typeof Schema)["SongRequestSummary"]>;
type TrackResponse = z.infer<(typeof Schema)["TrackResponse"]>;
type SongRequestSearchRecord = z.infer<
  (typeof Schema)["SongRequestSearchRecord"]
>;

export type {
  SongRequestRecord,
  SongRequestSubmission,
  SongRequestSummary,
  TrackResponse,
  SongRequestSearchRecord,
};
