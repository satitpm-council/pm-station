import { TrackResponse } from "@station/shared/schema/types";
import { create } from "zustand";

type SongRequestModalStore = {
  show: boolean;
  selectedTrack: TrackResponse | null;
};
export const songRequestModalStore = create<SongRequestModalStore>((set) => ({
  show: false,
  selectedTrack: null,
}));
