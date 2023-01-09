import MiniPlayer from "./components/MiniPlayer";
import BottomSheet from "./components/BottomSheet";
import Queue from "./components/Queue";

export default function SongRequestTab() {
  return (
    <>
      <h1 className="font-bold text-4xl">สถานะ</h1>
      <Queue />
      <MiniPlayer />
      <BottomSheet />
    </>
  );
}
