"use client";
import { AnimatePresence } from "framer-motion";
import { projectorStore } from "kiosk-web/store/projector";
import ProgramView from "./ProgramView";
import TrackView from "./TrackView";
export default function AnimatedView() {
  const track = projectorStore((state) => state.currentTrack);
  return (
    <AnimatePresence>
      {track && <TrackView track={track} />}
      {!track && <ProgramView />}
    </AnimatePresence>
  );
}
