import type { QueryConstraint } from "@lemasc/swr-firestore";
import { orderBy, where } from "@lemasc/swr-firestore/constraints";
import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import { LastPlayedDate } from "../../date";
import type { ListParams } from "../../sort";

export const getLastPlayedAtFromFilter = (
  filter: ListParams["filter"]
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
