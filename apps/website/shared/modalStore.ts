import {
  ParsedTrackMetadata,
  TrackOrSongRequest,
} from "@/components/music-interactions/parse";
import { TrackResponse } from "@/schema/songrequests";
import { create } from "zustand";

type SongRequestModalStore = {
  show: boolean;
  selected: ParsedTrackMetadata | null;
};

export const songRequestModalStore = create<SongRequestModalStore>((set) => ({
  show: false,
  selected: null,
}));
