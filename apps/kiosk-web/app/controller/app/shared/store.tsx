import create from "zustand";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "kiosk-socket/types/socket-interfaces";
import { Socket } from "socket.io-client";
import { User } from "@station/shared/user";

type ContollerState = {
  isConnected: boolean;
  socket?: Socket<ServerToClientEvents, ClientToServerEvents>;
  user?: User;
  playlistId?: string;
  showBottomSheet: boolean
};

export const controllerStore = create<ContollerState>((set) => ({
  isConnected: false,
  showBottomSheet: false
}));
