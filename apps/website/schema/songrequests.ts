/**
 * These schemas are legacy import from the old monorepo structure.
 * It will be migrated in the future.
 */

export {
  SongRequestRecord as songRequestSchema,
  SongRequestSubmission as songRequestSubmissionSchema,
  TrackResponse as trackResponseSchema,
} from "@station/shared/schema";

export type {
  SongRequestRecord as SongRequest,
  SongRequestSubmission,
  TrackResponse,
} from "@station/shared/schema/types";
