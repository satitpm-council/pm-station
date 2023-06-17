import { searchTrack } from "@/music-engine/spotify";
import SongRequestItem from "./Item";
import { SelectTrackModal } from "./SelectModal";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const tracks = await searchTrack(decodeURIComponent(searchParams.q));
  return (
    <div className="flex flex-col gap-4">
      <span>เลือกรายการเพลงที่ต้องการส่งคำขอ</span>
      <SelectTrackModal />
      <div className="flex flex-col md:flex-row md:flex-wrap gap-4 md:gap-8">
        {tracks.map((track) => (
          <SongRequestItem key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
}
