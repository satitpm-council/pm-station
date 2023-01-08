import type { NumericMenuConnectorParamsItem } from "instantsearch.js/es/connectors/numeric-menu/connectNumericMenu";

import type { SongRequestRecord } from "@station/shared/schema/types";
import type { OrderByDirection } from "firebase/firestore";
import { LastPlayedDate } from "@station/client/songrequests";
import type { TrackStatus } from "@station/client/songrequests";

export type ListParams = {
  sortBy: keyof SongRequestRecord;
  order: OrderByDirection;
  page?: number;
  filter: TrackStatus;
};

type SortInstantSearchItems = NumericMenuConnectorParamsItem & {
  name: ListParams["filter"];
};

export const SortItems: SortInstantSearchItems[] = [
  {
    label: "ทั้งหมด",
    name: "all",
  },
  {
    label: "ยังไม่ถูกเล่น",
    start: LastPlayedDate.Idle.valueOf(),
    end: LastPlayedDate.Idle.valueOf(),
    name: "idle",
  },
  {
    label: "เล่นไปแล้ว",
    start: LastPlayedDate.Idle.valueOf() + 1,
    name: "played",
  },
  {
    label: "ถูกปฏิเสธ",
    end: LastPlayedDate.Rejected.valueOf(),
    name: "rejected",
  },
];
