"use client";

import { motion, AnimatePresence } from "framer-motion";
import { controllerStore } from "../store/store";

export default function MiniPlayer() {
  const show = controllerStore((state) => state.showBottomSheet);
  return (
    <>
      <AnimatePresence>
        {!show && (
          <footer className="z-20 fixed bottom-0 left-0 right-0 w-full flex justify-center">
            <motion.button
              onClick={() =>
                controllerStore.setState({ showBottomSheet: true })
              }
              initial={{ translateY: "100%" }}
              animate={{ translateY: "0px" }}
              exit={{ translateY: "100%" }}
              transition={{ duration: 0.4 }}
              className="w-full flex items-center justify-between px-6 py-5 shadow-lg bg-[#222222]"
            >
              <b>ยังไม่มีรายการเพลง</b>
            </motion.button>
          </footer>
        )}
      </AnimatePresence>
    </>
  );
}
