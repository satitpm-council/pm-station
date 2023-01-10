import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "kiosk-socket/types/socket-interfaces";
import { Socket } from "socket.io-client";
import { User } from "@station/shared/user";
import { SongRequestRecord } from "@station/shared/schema/types";
import { ValidatedDocument } from "@lemasc/swr-firestore";

export type Track = ValidatedDocument<SongRequestRecord>;
type ContollerState = {
  queue: Set<Track>;
  isConnected: boolean;
  socket?: Socket<ServerToClientEvents, ClientToServerEvents>;
  user?: User;
  playlistId?: string;
  showBottomSheet: boolean;
  playingTrack?: Track;
};

export const addTrack = (track: Track) => {
  controllerStore.setState((s) => ({
    ...s,
    queue: new Set<Track>(s.queue).add(track),
  }));
};

export const controllerStore = create<ContollerState>()(
  subscribeWithSelector((set) => ({
    isConnected: false,
    showBottomSheet: false,
    queue: new Set(),
  }))
);
