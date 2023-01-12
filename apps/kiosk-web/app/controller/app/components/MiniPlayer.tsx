"use client";

import { motion, AnimatePresence } from "framer-motion";
import { controllerStore } from "kiosk-web/store/controller";
import { useCallback } from "react";
import { MediaStatusButtonIcon, MiniPlayerItem } from "./MiniPlayer/item";

function MiniPlayer() {
  const currentTrack = controllerStore((state) => state.playingTrack);

  return (
    <div className="flex w-full items-stretch text-left">
      <div className="py-3 px-4 flex-grow flex items-center h-full">
        {currentTrack ? (
          <>
            <MiniPlayerItem track={currentTrack} />
          </>
        ) : (
          <b className="py-2">ยังไม่มีรายการเพลง</b>
        )}
      </div>
      <MediaStatusButtonIcon className="bg-zinc-700 hover:bg-zinc-800 px-4" />
    </div>
  );
}

export default function BottomMiniPlayer() {
  const show = controllerStore((state) => state.showBottomSheet);
  const onClick = useCallback(() => {
    const { playingTrack } = controllerStore.getState();
    if (!playingTrack) return;
    controllerStore.setState({ showBottomSheet: true });
  }, []);
  return (
    <>
      <AnimatePresence>
        {!show && (
          <motion.div
            onClick={onClick}
            initial={{ translateY: "100%", opacity: 0 }}
            animate={{ translateY: "0px", opacity: 0.95 }}
            exit={{ translateY: "100%", opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full flex items-center justify-between bg-[#222222]"
          >
            <MiniPlayer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
