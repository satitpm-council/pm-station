import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import dayjs, { Dayjs } from "dayjs";
import { TrackResponse } from "@station/shared/schema/types";

type ProjectorStore = {
  datetime: Dayjs;
  status?: "landing" | "program" | "end";
  currentTrack?: TrackResponse;
  durationTimeout?: NodeJS.Timeout;
};

export const projectorStore = create<ProjectorStore>()(
  subscribeWithSelector(() => ({
    datetime: dayjs(),
  }))
);
