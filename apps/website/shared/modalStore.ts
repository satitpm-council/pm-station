import { TrackResponse } from "@/schema/songrequests";
import { create } from "zustand";

type SongRequestModalStore = {
  show: boolean;
  selectedTrack: TrackResponse | null;
};
export const songRequestModalStore = create<SongRequestModalStore>((set) => ({
  show: false,
  selectedTrack: null,
}));
