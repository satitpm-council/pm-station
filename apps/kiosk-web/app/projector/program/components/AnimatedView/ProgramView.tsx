"use client";

import { motion } from "framer-motion";
import { isDocumentValid } from "@lemasc/swr-firestore";

import { usePlaylist } from "@station/client/playlists";
import { useProgram } from "kiosk-web/shared/useProgram";
import { controllerStore } from "kiosk-web/store/controller";
import { useMemo } from "react";
import { projectorStore } from "kiosk-web/store/projector";

const days = [
  "อาทิตย์",
  "จันทร์",
  "อังคาร",
  "พุธ",
  "พฤหัสบดี",
  "ศุกร์",
  "เสาร์",
];

export default function ProgramView() {
  const programId = controllerStore((state) => state.programId);
  const { data } = useProgram(programId, {
    listen: true,
  });

  const daysInThai = projectorStore((state) => days[state.datetime.day()]);
  const playlistId = controllerStore((state) => state.playlistId);
  const { data: playlist } = usePlaylist(playlistId, {
    listen: true,
  });

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: "linear", duration: 0.6 }}
      className="flex-1 h-full flex flex-col items-center justify-center gap-8 p-14"
    >
      <span>ขณะนี้คุณกำลังรับฟังรายการ</span>
      <h2 className="text-6xl font-bold">
        {data && isDocumentValid(data) && data.name}
      </h2>
      <span className="text-3xl opacity-75">
        ทุกวัน{daysInThai} เวลา 07:00 - 07:40 น.
      </span>
      <div className="flex flex-col gap-4 p-10 text-2xl text-center">
        <h3 className="text-3xl font-medium">ดำเนินรายการโดย:</h3>
        <ul className="leading-10">
          {playlist &&
            isDocumentValid(playlist) &&
            playlist.speakers?.map((speaker) => (
              <li key={speaker}>{speaker}</li>
            ))}
        </ul>
      </div>
    </motion.div>
  );
}
