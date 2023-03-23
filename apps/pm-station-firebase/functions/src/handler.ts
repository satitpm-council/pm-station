import * as functions from "firebase-functions";
import type { DocumentBuilder } from "firebase-functions/v1/firestore";

import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { paths } from "./config";

const app = initializeApp();
const db = getFirestore(app);

type Handler<Path extends string> = Parameters<
  DocumentBuilder<Path>["onCreate"]
>["0"];

const handleSongRequestChange = (
  increment: number
): Handler<typeof paths["submission"]> => {
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

const applyToSongRequestSummary = (
  increment: number
): Handler<typeof paths["track"]> => {
  return async (change, context) => {
    functions.logger.log("params", context.params);
    const { trackId } = context.params;
    if (!trackId) {
      throw new Error("trackId not found");
    }
    if (trackId === "summary") return;
    const changedData = change.data();
    if (changedData.submissionCount === -1) {
      // Remove the record
      await db.collection("songrequests").doc(trackId).delete();
    }
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
export { handleSongRequestChange, applyToSongRequestSummary };
