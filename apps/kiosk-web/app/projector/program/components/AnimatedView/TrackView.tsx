"use client";

import { isDocumentValid } from "@lemasc/swr-firestore";
import TrackThumbnail from "@station/client/TrackThumbnail";
import { TrackResponse } from "@station/shared/schema/types";
import { motion } from "framer-motion";
import { useProgram } from "kiosk-web/shared/useProgram";
import { controllerStore } from "kiosk-web/store/controller";

export default function TrackView({ track }: { track: TrackResponse }) {
  const programId = controllerStore((state) => state.programId);
  const { data } = useProgram(programId, {
    listen: true,
  });

  if (!data) return null;
  return (
    <motion.div
      layout
      className="-mt-4 flex flex-col items-center justify-center h-full gap-10"
    >
      <motion.span
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-3xl font-medium"
        transition={{ ease: "easeOut", duration: 2 }}
      >
        รายการ {data && isDocumentValid(data) && data.name}
      </motion.span>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ ease: "easeOut", duration: 2 }}
        className="flex flex-row gap-16 items-center justify-center"
      >
        <div className="z-10">
          <TrackThumbnail
            track={track}
            className={{
              wrapper: "basis-1/4 relative",
              image: "w-full h-auto min-w-[400px] rounded-lg",
            }}
          />
        </div>
        <motion.div
          layout
          initial={{ opacity: 0, translateX: "-100%" }}
          animate={{ opacity: 1, translateX: 0 }}
          exit={{ opacity: 0, translateX: "-100%" }}
          style={{ zoom: 1.1 }}
          transition={{ ease: "easeOut", duration: 3 }}
          className="flex flex-col items-start justify-center gap-8 text-4xl"
        >
          <span className="text-3xl">เพลงปัจจุบัน</span>
          <div className="text-6xl font-bold max-w-lg leading-snug">
            {track.name}
          </div>
          <span>{track.artists.join("/")}</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
