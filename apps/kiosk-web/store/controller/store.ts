import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { ControllerSendEvents } from "kiosk-socket/types/socket/controller";
import { Socket } from "socket.io-client";
import { User } from "@station/shared/user";
import { SongRequestRecord } from "@station/shared/schema/types";
import { ValidatedDocument } from "@lemasc/swr-firestore";

export type Track = ValidatedDocument<SongRequestRecord>;

export type MediaStatus = "playing" | "paused" | "error" | null;

export type ClientSocket = Socket<never, ControllerSendEvents>;

type ContollerState = {
  queue: Set<Track>;
  isConnected: boolean;
  socket?: ClientSocket;
  user?: User;
  playlistId?: string;
  programId?: string;
  showBottomSheet: boolean;
  playingTrack?: Track;
  mediaStatus: MediaStatus;
};

export const controllerStore = create<ContollerState>()(
  subscribeWithSelector((set) => ({
    isConnected: false,
    showBottomSheet: false,
    queue: new Set(),
    mediaStatus: null,
  }))
);
