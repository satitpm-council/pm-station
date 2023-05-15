import { Metadata } from "next";
import SongSelector from "../components/SongSelector";

export const metadata: Metadata = {
  title: "ส่งคำขอ",
};

export default function SongRequestsPage() {
  return (
    <>
      <div className="flex flex-col flex-1 gap-4 text-white h-full overflow-auto">
        <b className="font-bold text-2xl">เพิ่มเพลงลงในรายการเล่น</b>
        <SongSelector />
      </div>
    </>
  );
}
