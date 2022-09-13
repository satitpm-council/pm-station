import admin from "../firebase-admin.server";
import type {
  DocumentReference,
  WithFieldValue,
  Timestamp,
} from "firebase-admin/firestore";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import type { TrackResponse } from "./search";
import { getTrack } from "./search";
import type {
  SongRequestRecord,
  SongRequestSubmission,
} from "~/schema/pm-station/songrequests/types";

export type SongRequestRecord_V0 = {
  id: string;
  artists: string[];
  external_urls: string;
  name: string;
  selectedAt: Timestamp;
  selectedBy: DocumentReference[];
};

export const selectTrack = async (uid: string, response: TrackResponse) => {
  const db = getFirestore(admin);
  return db.runTransaction(async (transaction) => {
    const submission: WithFieldValue<SongRequestSubmission> = {
      submittedBy: uid,
      updatedAt: FieldValue.serverTimestamp(),
      trackId: response.id,
    };
    const trackDoc = db.doc(`/songrequests/${response.id}`);
    const trackDocResult = await transaction.get(trackDoc);
    if (!trackDocResult.exists) {
      const record: WithFieldValue<
        Omit<SongRequestRecord, "submissionCount" | "lastUpdatedAt">
      > = {
        ...response,
        version: 1,
      };
      transaction.set(trackDoc, record, {
        merge: true,
      });
    }
    transaction.set(
      db.doc(`/songrequests/${response.id}/submission/${uid}`),
      submission
    );
  });
};

export const upgradeResponse = async (
  uid: string,
  _data: any,
  version?: SongRequestRecord["version"]
) => {
  switch (version) {
    case undefined:
      const data = _data as SongRequestRecord_V0;
      return selectTrack(uid, await getTrack(data.id));
  }
};
