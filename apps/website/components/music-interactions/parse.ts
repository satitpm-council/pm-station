import { WithXataMetadata } from "@station/db";
import {
  SongRequest,
  TrackResponse,
  songRequestSchema,
  trackResponseSchema,
} from "@/schema/songrequests";

export type TrackOrSongRequest = WithXataMetadata<SongRequest> | TrackResponse;

export type ParsedTrackMetadata = {} & (
  | {
      type: "track";
      data: TrackResponse;
    }
  | WithXataMetadata<{
      type: "record";
      data: SongRequest;
    }>
);

export function parseMetadata(data: TrackOrSongRequest): ParsedTrackMetadata {
  try {
    const record = songRequestSchema.parse(data);
    return {
      type: "record",
      data: record,
      metadata: (data as WithXataMetadata<SongRequest>).metadata,
    };
  } catch {}
  return {
    type: "track",
    data: trackResponseSchema.parse(data),
  };
}
