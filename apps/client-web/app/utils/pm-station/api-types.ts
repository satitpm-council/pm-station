import type { TrackResponse } from "~/utils/pm-station/spotify/index.server";

export type LoginAction = {
  token: string;
  continueUrl: string;
};

export type SelectTrackAction = {
  sessionToken: string;
  trackId: string;
};

export type SelectTrackActionResponse = {
  success: boolean;
  track?: TrackResponse;
  code?: string;
};

export type UpdateProfileActionResponse = {
  success: boolean;
  error?: string;
};
