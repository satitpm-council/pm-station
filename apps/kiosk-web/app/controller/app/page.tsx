"use client";

import MiniPlayer from "./components/MiniPlayer";
import BottomSheet from "./components/BottomSheet";

export default function SongRequestTab() {
  return (
    <>
      <h1 className="font-bold text-4xl">สถานะ</h1>
      <MiniPlayer />
      <BottomSheet />
    </>
  );
}
