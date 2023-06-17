import { z } from "zod";
import { HitResult, mapObjectIdToId } from "../algolia";
import { docRef, preprocessDate } from "../utils";

const SongRequestSummary = z.object({
  lastUpdatedAt: z.preprocess(preprocessDate, z.date()),
  submissionCount: z.number().min(0),
  trackCount: z.number().min(0),
  isSummary: z.boolean(),
});

const TrackResponse = z.object({
  explicit: z.boolean(),
  title: z.string(),
  duration: z.number(),
  id: z.string(),
  preview_url: z.string().nullable(),
  artists: z.array(z.string()),
  thumbnail_height: z.number().optional(),
  thumbnail_url: z.string(),
  thumbnail_width: z.number().optional(),
  permalink: z.string(),
});

const SongRequestRecord = TrackResponse.extend({
  playlistId: z.array(z.preprocess(docRef, z.string())).optional(),
  youtubeId: z.string().optional(),
});

const SongRequestSubmission = z.object({
  submittedBy: z.string(),
  updatedAt: z.preprocess(preprocessDate, z.date()),
  trackId: z.string(),
});

const SongRequestSearchRecord = SongRequestRecord.pick({
  thumbnail_height: true,
  thumbnail_url: true,
  thumbnail_width: true,
  artists: true,
  title: true,
  playlistId: true,
  explicit: true,
})
  .merge(HitResult)
  .transform(mapObjectIdToId);

export {
  TrackResponse,
  SongRequestRecord,
  SongRequestSubmission,
  SongRequestSummary,
  SongRequestSearchRecord,
};
