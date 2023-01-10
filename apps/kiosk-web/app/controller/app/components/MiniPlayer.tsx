"use client";

import { motion, AnimatePresence } from "framer-motion";
import { controllerStore } from "../store/store";

export default function MiniPlayer() {
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
            className="w-full flex items-center justify-between px-6 py-4 bg-[#222222]"
          >
            <b>ยังไม่มีรายการเพลง</b>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
