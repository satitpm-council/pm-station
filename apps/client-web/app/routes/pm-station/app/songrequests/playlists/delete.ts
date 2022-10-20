import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { captureException } from "@sentry/remix";
import type { DeletePlaylistAction } from "~/utils/pm-station/api-types";
import { setPlaylist } from "~/utils/pm-station/playlists/set";

export const action: ActionFunction = async ({ request }) => {
  const { playlistId } = (await request.json()) as DeletePlaylistAction;
  try {
    await setPlaylist([], undefined, playlistId);
    return json({ success: true });
  } catch (err) {
    console.error(err);
    captureException(err);
    return json({ success: false });
  }
};
