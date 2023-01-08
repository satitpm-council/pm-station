import type { QueryConstraint } from "@lemasc/swr-firestore";
import { orderBy, where } from "@lemasc/swr-firestore/constraints";
import type { SongRequestRecord } from "@station/shared/schema/types";
import { LastPlayedDate } from "@station/client/songrequests";
import type { TrackStatus } from "@station/client/songrequests";

export const getLastPlayedAtFromFilter = (
  filter: TrackStatus
): QueryConstraint<SongRequestRecord>[] => {
  if (filter === "idle")
    return [where("lastPlayedAt", "==", LastPlayedDate.Idle)];
  if (filter === "rejected") {
    return [where("lastPlayedAt", "==", LastPlayedDate.Rejected)];
  }
  if (filter === "played") {
    return [
      where("lastPlayedAt", ">", LastPlayedDate.Idle),
      orderBy("lastPlayedAt", "asc"),
    ];
  }
  return [];
};
