import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import type { DocumentBuilder } from "firebase-functions/v1/firestore";

admin.initializeApp();

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

type Handler = Parameters<DocumentBuilder["onCreate"]>["0"];

const handleSongRequestChange = (increment: number): Handler => {
  return async (change, context) => {
    functions.logger.log("params", context.params);
    const { userId, trackId } = context.params;
    if (!userId || !trackId) {
      throw new Error(`trackId or userId not found, cannot continue.`);
    }
    await db
      .collection("songrequests")
      .doc(trackId)
      .set(
        {
          lastUpdatedAt: FieldValue.serverTimestamp(),
          submissionCount: FieldValue.increment(increment),
        },
        {
          merge: true,
        }
      );
    await db
      .collection("songrequests")
      .doc("summary")
      .set(
        {
          lastUpdatedAt: FieldValue.serverTimestamp(),
          submissionCount: FieldValue.increment(increment),
          isSummary: true,
        },
        {
          merge: true,
        }
      );
  };
};

const applyToSongRequestSummary = (increment: number): Handler => {
  return async (change, context) => {
    functions.logger.log("params", context.params);
    const { trackId } = context.params;
    if (!trackId) {
      throw new Error("trackId not found");
    }
    if (trackId === "summary") return;
    await db
      .collection("songrequests")
      .doc("summary")
      .set(
        {
          lastUpdatedAt: FieldValue.serverTimestamp(),
          trackCount: FieldValue.increment(increment),
          isSummary: true,
        },
        {
          merge: true,
        }
      );
  };
};

export const addSongRequest = functions.firestore
  .document("/songrequests/{trackId}/submission/{userId}")
  .onCreate(handleSongRequestChange(1));

export const removeSongRequest = functions.firestore
  .document("/songrequests/{trackId}/submission/{userId}")
  .onDelete(handleSongRequestChange(-1));

export const addToSongRequestSummary = functions.firestore
  .document("/songrequests/{trackId}")
  .onCreate(applyToSongRequestSummary(1));

export const removeFromSongRequestSummary = functions.firestore
  .document("/songrequests/{trackId}")
  .onDelete(applyToSongRequestSummary(-1));
