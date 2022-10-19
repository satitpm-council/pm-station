import { getFirestore } from "firebase-admin/firestore";
import { FieldValue } from "firebase-admin/firestore";
import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import type {
  PlaylistRecord,
  SetPlaylistAction,
} from "~/schema/pm-station/playlists/types";
import admin from "../firebase-admin.server";
import dayjs from "dayjs";

const PlaylistIdField: keyof SongRequestRecord = "playlistId";

/**
 * Set playlists record and apply any song requests changes.
 *
 * @param data The program's `target` and `queuedDate`.
 * @param tracks The tracks to be saved. Pass an empty array will delete the playlist.
 * @param targetPlaylistId (Optional) The playlist ID to updated.
 */
export const setPlaylist = async (
  data: Pick<SetPlaylistAction, "queuedDate" | "target">,
  tracks: string[],
  targetPlaylistId?: string
) => {
  const db = getFirestore(admin);
  // contains desired tracks to be contained on the playlist
  const tracksSet = new Set(tracks);
  const songRequests = db.collection("songrequests");
  const playlists = db.collection("playlists");

  // move out of transaction to persist across reruns.
  const playlistDoc = targetPlaylistId
    ? playlists.doc(targetPlaylistId)
    : playlists.doc();
  await db.runTransaction(async (transaction) => {
    if (targetPlaylistId) {
      // query for any tracks that contains the given playlistId
      // and remove if the playlist now doesn't exists.
      const tracksWithId = await transaction.get(
        songRequests.where(PlaylistIdField, "array-contains", playlistDoc)
      );
      tracksWithId.docs.forEach((doc) => {
        if (!tracksSet.has(doc.id)) {
          transaction.update(doc.ref, {
            lastPlayedAt: null,
            [PlaylistIdField]: FieldValue.arrayRemove(playlistDoc),
          });
        }
      });
    }
    // add, or update new tracks to include the playlistId
    const queuedDate = dayjs(data.queuedDate).hour(7);
    const status: PlaylistRecord["status"] = dayjs().isAfter(queuedDate)
      ? "played"
      : "queued";
    tracks
      .map((id) => songRequests.doc(id))
      .forEach((ref) => {
        transaction.update(ref, {
          // TODO: Use the last playlist lastPlayedAt if exists.
          lastPlayedAt: status === "played" ? queuedDate.toDate() : null,
          [PlaylistIdField]: FieldValue.arrayUnion(playlistDoc),
        });
      });
    // finally, update the playlist doc.
    if (tracks.length > 0) {
      const playlistData: PlaylistRecord = {
        queuedDate: queuedDate.toDate(),
        status,
        target: data.target,
        totalTracks: tracks.length,
      };
      transaction.set(playlistDoc, playlistData);
    } else if (targetPlaylistId) {
      // existing playlist and no tracks, delete it.
      transaction.delete(playlistDoc);
    }
  });
};
