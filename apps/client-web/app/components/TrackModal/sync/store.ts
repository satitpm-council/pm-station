import type { MusicInfo } from "@station/shared/ytmusic";
import create from "zustand";

type SyncModalStore = {
  results: MusicInfo[] | null;
  customResults: Map<number, MusicInfo>;
};

const defaults: SyncModalStore = {
  customResults: new Map(),
  results: null,
};
const syncModalStore = create<SyncModalStore>(() => defaults);
export const resetStore = () => syncModalStore.setState(defaults);

export { syncModalStore };
