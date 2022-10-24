import createStore from "zustand";
import type { ListParams } from "~/utils/pm-station/songrequests";

type SongRequestListState = {
  filterStatus: ListParams["filter"];
  firestoreRecords: Set<string>;
};

type SongRequestListStoreType = SongRequestListState & {
  reset: () => void;
  /** Set to `true` to update the SongRequestList to reload data. */
  refresh?: boolean;
};
const defaults: SongRequestListState = {
  filterStatus: "all",
  firestoreRecords: new Set(),
};

export const SongRequestListStore = createStore<SongRequestListStoreType>(
  (set) => ({
    ...defaults,
    reset: () => set(defaults),
  })
);
