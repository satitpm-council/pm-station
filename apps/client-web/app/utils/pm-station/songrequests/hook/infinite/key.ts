import type { Document } from "@lemasc/swr-firestore";
import type { User } from "firebase/auth";
import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import type { ListParams } from "../../types";

type GetKeyParams = {
  user: User | null | undefined;
  context: ListParams;
};
export const getKey =
  ({ user, context }: GetKeyParams) =>
  (pageIndex: number, previousPageData: Document<SongRequestRecord>[][]) => {
    if (!user) return null;
    if (previousPageData && !previousPageData.length) return null; // reached the end
    const { order, sortBy, filter } = context;
    const params: ListParams = {
      order,
      sortBy,
      page: pageIndex,
      filter,
    };
    return ["/songrequests", params];
  };