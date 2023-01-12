import admin from "@station/server/firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { PlaylistRecord } from "@station/shared/schema";
import { TypeOf } from "zod";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import tz from "dayjs/plugin/timezone";
import { ValidatedDocument } from "@lemasc/swr-firestore";

dayjs.extend(utc);
dayjs.extend(tz);

const db = getFirestore(admin);

export const getTodayPlaylist = async (): Promise<
  ValidatedDocument<TypeOf<typeof PlaylistRecord>>
> => {
  const date = dayjs()
    .tz("Asia/Bangkok")
    .date(6)
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);
  const { docs } = await db
    .collection("playlists")
    .where("queuedDate", ">", date.toDate())
    .limit(1)
    .get();
  if (docs.length !== 1) {
    throw new Error(`No playlist as of ${date.format("DD/MM/YYYY")}.`);
  }
  try {
    return {
      ...PlaylistRecord.parse(docs[0].data()),
      id: docs[0].id,
      exists: true,
      validated: true,
    };
  } catch (err) {
    throw new Error(
      `Playlist was existed, but invalid for the current schema.`
    );
  }
};
