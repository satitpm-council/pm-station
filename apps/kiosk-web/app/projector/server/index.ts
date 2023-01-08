import admin from "@station/server/firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { redirect, notFound } from "next/navigation";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { PlaylistRecord } from "@station/shared/schema/types";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Bangkok");

export const getPlaylist = async () => {
  const db = getFirestore(admin);
  const playlists = await db
    .collection("playlists")
    .where(
      "queuedDate",
      "==",
      dayjs
        .tz(dayjs("Fri, 06 Jan 2023 00:00:00 GMT"))
        .hour(7)
        .minute(0)
        .second(0)
        .millisecond(0)
        .toDate()
    )
    .limit(1)
    .get();
  return playlists.docs[0]?.data() as PlaylistRecord | undefined;
};

export const checkPlaylistAndRedirect = async () => {
  const playlist = await getPlaylist();
  if (playlist) {
    const now = dayjs.tz(dayjs());
    if (!now.isBefore(playlist.queuedDate)) {
      redirect("/projector/landing");
    } else {
      redirect(`/projector/program`);
    }
  } else {
    notFound();
  }
};
