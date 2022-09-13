import { z } from "zod";

const preprocessDate = (arg: unknown) => {
  if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
};

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
  version: z.number().min(1).optional(),
  submissionCount: z.number(),
  lastUpdatedAt: z.string(),
});

const SongRequestSubmission = z.object({
  submittedBy: z.string(),
  updatedAt: z.preprocess(preprocessDate, z.date()),
  trackId: z.string(),
});

export {
  TrackResponse,
  SongRequestRecord,
  SongRequestSubmission,
  SongRequestSummary,
};
