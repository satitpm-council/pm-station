import type {
  SongRequestRecord,
  TrackResponse,
} from "~/schema/pm-station/songrequests/types";

export type LoginAction = {
  token: string;
  continueUrl: string;
};

/**
 * Contains the CSRF token to verify the action on the server.
 */
export interface ActionWithSession {
  sessionToken: string;
}

export type SessionActionResponse = {
  success: boolean;
  token: string;
};

export interface SelectTrackAction extends ActionWithSession {
  trackId: string;
}

export interface ActionResponse {
  success: boolean;
  error?: string;
}

export interface SelectTrackActionResponse extends ActionResponse {
  track?: TrackResponse;
  code?: string;
}

export interface ListSongRequestsResponse extends ActionResponse {
  data: SongRequestRecord[];
}
