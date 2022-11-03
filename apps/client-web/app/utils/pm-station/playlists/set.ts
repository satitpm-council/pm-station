import { getFirestore } from "firebase-admin/firestore";
import { FieldValue } from "firebase-admin/firestore";
import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import type {
  PlaylistRecord,
  SetPlaylistAction,
} from "~/schema/pm-station/playlists/types";
import admin from "../firebase-admin.server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { LastPlayedDate } from "../songrequests/date";

dayjs.extend(utc);

const PlaylistIdField: keyof SongRequestRecord = "playlistId";

/**
 * Set playlists record and apply any song requests changes.
 *
 * @param data The program's `target` and `queuedDate`.
 * @param tracks The tracks to be saved. Pass an empty array will delete the playlist.
 * @param targetPlaylistId (Optional) The playlist ID to updated.
 */
export const setPlaylist = async (
  tracks: string[],
  data?: Pick<SetPlaylistAction, "queuedDate" | "target">,
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
            lastPlayedAt: LastPlayedDate.Idle,
            [PlaylistIdField]: FieldValue.arrayRemove(playlistDoc),
          });
        }
      });
    }
    if (data && tracks.length > 0) {
      // add, or update new tracks to include the playlistId

      // formating the date as UTC also set hours to 7.
      const queuedDate = dayjs.utc(data.queuedDate);
      const status: PlaylistRecord["status"] = dayjs().isAfter(queuedDate)
        ? "played"
        : "queued";
      tracks
        .map((id) => songRequests.doc(id))
        .forEach((ref) => {
          transaction.update(ref, {
            // TODO: Use the last playlist lastPlayedAt if exists.
            lastPlayedAt:
              status === "played" ? queuedDate.toDate() : new Date(0),
            [PlaylistIdField]: FieldValue.arrayUnion(playlistDoc),
          });
        });

      // finally, update the playlist doc.
      const playlistData: PlaylistRecord = {
        queuedDate: queuedDate.toDate(),
        status,
        target: data.target,
        totalTracks: tracks.length,
      };
      transaction.set(playlistDoc, playlistData);
    } else if (tracks.length === 0 && !data && targetPlaylistId) {
      // existing playlist, no tracks, no data. delete it.
      transaction.delete(playlistDoc);
    }
  });
};
