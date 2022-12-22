import { z } from "zod";
import { HitResult, mapObjectIdToId } from "~/schema/algolia";
import { docRef, preprocessDate } from "~/schema/utils";

const SongRequestSummary = z.object({
  lastUpdatedAt: z.preprocess(preprocessDate, z.date()),
  submissionCount: z.number().min(0),
  trackCount: z.number().min(0),
  isSummary: z.boolean(),
});

const TrackResponse = z.object({
  explicit: z.boolean(),
  name: z.string(),
  duration_ms: z.number(),
  id: z.string(),
  preview_url: z.string().nullable(),
  uri: z.string(),
  artists: z.array(z.string()),
  albumImage: z.object({
    height: z.number().optional(),
    url: z.string(),
    width: z.number().optional(),
  }),
  external_urls: z.string(),
});

const SongRequestRecord = TrackResponse.extend({
  version: z.number().min(1),
  submissionCount: z.number(),
  lastUpdatedAt: z.preprocess(preprocessDate, z.date()),
  lastPlayedAt: z.preprocess(preprocessDate, z.date()),
  playlistId: z.array(z.preprocess(docRef, z.string())).optional(),
  youtubeId: z.string().optional(),
});

const SongRequestSubmission = z.object({
  submittedBy: z.string(),
  updatedAt: z.preprocess(preprocessDate, z.date()),
  trackId: z.string(),
});

const SongRequestSearchRecord = SongRequestRecord.pick({
  albumImage: true,
  artists: true,
  name: true,
  lastPlayedAt: true,
  lastUpdatedAt: true,
  playlistId: true,
  submissionCount: true,
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
