import * as functions from "firebase-functions";
import { paths } from "./config";
import { applyToSongRequestSummary, handleSongRequestChange } from "./handler";

export const addSongRequest = functions.firestore
  .document(paths.submission)
  .onCreate(handleSongRequestChange(1));

export const removeSongRequest = functions.firestore
  .document(paths.submission)
  .onDelete(handleSongRequestChange(-1));

export const addToSongRequestSummary = functions.firestore
  .document(paths.track)
  .onCreate(applyToSongRequestSummary(1));

export const removeFromSongRequestSummary = functions.firestore
  .document(paths.track)
  .onDelete(applyToSongRequestSummary(-1));
