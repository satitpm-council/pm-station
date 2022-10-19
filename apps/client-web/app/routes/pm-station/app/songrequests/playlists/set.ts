import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { captureException } from "@sentry/remix";
import { SetPlaylistAction } from "~/schema/pm-station/playlists/schema";
import type { ActionResponse } from "~/utils/pm-station/api-types";
import { setPlaylist } from "~/utils/pm-station/playlists/set";

export const action: ActionFunction = async ({ request }) => {
  try {
    const { queuedDate, target, tracks, playlistId } = SetPlaylistAction.parse(
      await request.json()
    );
    try {
      await setPlaylist({ queuedDate, target }, tracks, playlistId);
      return json<ActionResponse>({ success: true });
    } catch (err) {
      console.error(err);
      captureException(err);
      return json<ActionResponse>(
        { success: false, error: "server-error" },
        500
      );
    }
  } catch {
    return json<ActionResponse>({ success: false, error: "bad-request" });
  }
};
