import type { OrderByDirection, Timestamp } from "firebase-admin/firestore";
import { getFirestore } from "firebase-admin/firestore";
import admin from "../firebase-admin.server";
import type { SongRequestRecord } from "./select";
import FileSystemCache from "./cache";

export type ListParams = {
  page: number | null | undefined;
  sortBy: keyof SongRequestRecord;
  order: OrderByDirection;
};

type WithTimestamp<T> = {
  [P in keyof T]: T[P] | Timestamp;
};

export const listSongRequests = async ({
  page,
  order,
  sortBy,
}: ListParams): Promise<SongRequestRecord[]> => {
  const cache =
    process.env.NODE_ENV === "development"
      ? new FileSystemCache<SongRequestRecord[]>("firebase-api")
      : undefined;

  if (process.env.NODE_ENV === "development") {
    const cached = await cache?.get(`songrequests_${page}_${order}_${sortBy}`);
    if (cached) return cached;
  }
  const db = getFirestore(admin);
  let query = db.collection("songrequests").orderBy(sortBy, order);

  if (page && page > 1) {
    query = query.startAfter(page - 1 * 10);
  }

  query = query.limit(10);

  const { docs, empty } = await query.get();
  const result = docs.map((d) => {
    const data = d.data() as WithTimestamp<SongRequestRecord>;
    return {
      ...data,
      lastUpdatedAt: (data.lastUpdatedAt as Timestamp).toDate(),
    } as SongRequestRecord;
  });
  if (process.env.NODE_ENV === "development") {
    await cache?.set(`songrequests_${page}_${order}_${sortBy}`, result);
  }
  return result;
};
