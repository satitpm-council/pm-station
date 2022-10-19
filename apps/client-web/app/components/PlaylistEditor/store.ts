import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import dayjs from "~/utils/dayjs";
import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";
import type { PlaylistRecord } from "~/schema/pm-station/playlists/types";
import type { ValidatedDocument } from "@lemasc/swr-firestore";

type PlaylistEditorVars = {
  /** The current playlist, undefined means create a new one. */
  targetPlaylist?: ValidatedDocument<PlaylistRecord>;
  track?: SongRequestRecord;
  /** The target number of tracks to be in this playlist. */
  count: number;
  duration: string;
  data: SongRequestRecord[];
  addedIds: Set<string>;
  showModal: boolean;
};
type PlaylistEditorStore = PlaylistEditorVars & {
  addId: (id: string) => void;
  pushData: (data: SongRequestRecord[]) => void;
  remove: (trackId: string) => void;
  reset: () => void;
};

const defaults: PlaylistEditorVars = {
  count: 6,
  duration: "00:00",
  data: [],
  addedIds: new Set(),
  showModal: false,
  targetPlaylist: undefined,
};

const setTotalDuration = () => {
  const { data } = playlistEditorStore.getState();
  const total = data.reduce((total, { duration_ms }) => total + duration_ms, 0);
  playlistEditorStore.setState({
    duration: dayjs.duration(total).format("mm:ss"),
  });
};

export const playlistEditorStore = create(
  subscribeWithSelector<PlaylistEditorStore>((set) => ({
    ...defaults,
    reset: () => {
      set(defaults);
    },
    addId: (id) => {
      set((state) => ({ ...state, addedIds: state.addedIds.add(id) }));
    },
    pushData: (data) => {
      set((state) => ({ ...state, data: [...state.data, ...data] }));
      setTotalDuration();
    },
    remove: (trackId) => {
      set((state) => {
        state.addedIds.delete(trackId);
        state.data = state.data.filter(({ id }) => id !== trackId);
        return state;
      });
      setTotalDuration();
    },
  }))
);