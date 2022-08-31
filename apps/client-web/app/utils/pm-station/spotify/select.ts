import admin from "../firebase-admin.server";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

/// <reference types="spotify-api" />

export const selectTrack = async (
  uid: string,
  { id, artists, external_urls, name }: SpotifyApi.TrackObjectFull
) => {
  const db = getFirestore(admin);
  return db.doc(`/songrequests/${id}`).set({
    id,
    artists: artists.map((a) => a.name),
    external_urls: external_urls.spotify,
    name,
    selectedAt: FieldValue.serverTimestamp(),
    selectedBy: FieldValue.arrayUnion(db.doc(`/users/${uid}`)),
  });
};
