"use client";

import { motion, AnimatePresence } from "framer-motion";
import { controllerStore } from "kiosk-web/store/controller";
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
          <b>ยังไม่มีรายการเพลง</b>
        )}
      </div>
      <MediaStatusButtonIcon className="bg-red-500 hover:bg-zinc-600 px-4" />
    </div>
  );
}

export default function BottomMiniPlayer() {
  const show = controllerStore((state) => state.showBottomSheet);
  return (
    <>
      <AnimatePresence>
        {!show && (
          <motion.button
            onClick={() => controllerStore.setState({ showBottomSheet: true })}
            initial={{ translateY: "100%", opacity: 0 }}
            animate={{ translateY: "0px", opacity: 0.95 }}
            exit={{ translateY: "100%", opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full flex items-center justify-between bg-[#222222]"
          >
            <MiniPlayer />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
