import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { ProjectorRecieveEvents } from "kiosk-socket/types/socket/projector";
import { Socket } from "socket.io-client";
import dayjs, { Dayjs } from "dayjs";
import { TrackResponse } from "@station/shared/schema/types";

export type ClientSocket = Socket<ProjectorRecieveEvents, never>;

type ProjectorStore = {
  datetime: Dayjs;
  status?: "landing" | "program" | "end";
  currentTrack?: TrackResponse;
  durationTimeout?: NodeJS.Timeout;
  socket?: ClientSocket;
};

export const projectorStore = create<ProjectorStore>()(
  subscribeWithSelector(() => ({
    datetime: dayjs(),
  }))
);
