import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import type { OrderByDirection } from "firebase/firestore";

export type ListParams = {
  sortBy: keyof SongRequestRecord;
  order: OrderByDirection;
  page?: number;
};
