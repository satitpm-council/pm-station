import type { QueryConstraint } from "@lemasc/swr-firestore";
import { orderBy, where } from "@lemasc/swr-firestore/constraints";
import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import type { ListParams } from "../../types";

export const getLastPlayedAtFromFilter = (
  filter: ListParams["filter"]
): QueryConstraint<SongRequestRecord>[] => {
  if (filter === "idle") return [where("lastPlayedAt", "==", null)];
  if (filter === "rejected") {
    return [where("lastPlayedAt", "==", new Date(0))];
  }
  if (filter === "played") {
    return [
      where("lastPlayedAt", ">", new Date(0)),
      orderBy("lastPlayedAt", "asc"),
    ];
  }
  return [];
};
