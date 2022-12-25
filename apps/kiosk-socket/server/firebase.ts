import { validateAndParseDate } from "@lemasc/swr-firestore";
import admin from "@station/server/firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { zodValidator } from "shared/utils";
import { PlaylistRecord } from "@station/shared/schema";

import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
dayjs.extend(tz);

const auth = getAuth(admin);
export const verifyIdToken = auth.verifyIdToken;

const db = getFirestore(admin);
export const getTodayPlaylist = async () => {
  const date = dayjs()
    .tz("Asia/Bangkok")
    .hour(7)
    .minute(0)
    .second(0)
    .millisecond(0);
  const { docs } = await db
    .collection("playlists")
    .where("queuedDate", "==", date)
    .limit(1)
    .get();
  if (docs.length !== 1) {
    throw new Error(`No playlist as of ${date.format("DD/MM/YYYY")}.`);
  }
  return validateAndParseDate(docs[0] as any, {
    validator: zodValidator(PlaylistRecord),
  });
};
