import type { ListParams } from "./types";

/**
 * LastPlayedDate constraints set on the database records.
 */
export const LastPlayedDate = {
  /** Rejected request. Has a timestamp of `-1` */
  Rejected: new Date(-1),
  /** Idle request. Has a timestamp of `0` */
  Idle: new Date(0),
};

type TrackStatus = ListParams["filter"];

export const getStatusFromLastPlayedDate = (date?: Date): TrackStatus => {
  // undefined, 0 means idle
  return date?.valueOf()
    ? date.valueOf() > 0
      ? "played"
      : "rejected"
    : "idle";
};
