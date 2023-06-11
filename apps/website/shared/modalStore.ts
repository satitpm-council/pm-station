import { TrackResponse } from "@station/shared/schema/types";
import { create } from "zustand";

type SongRequestModalStore = {
  selectedTrack: TrackResponse | null;
};
export const songRequestModalStore = create<SongRequestModalStore>((set) => ({
  selectedTrack: null,
}));
