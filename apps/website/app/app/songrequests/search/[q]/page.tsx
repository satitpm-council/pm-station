import { searchTrack } from "@/music-engine/spotify";
import SongRequestItem from "./Item";

// The edge runtime has been tested on the Spotify music engine only.
// YouTube Music engine is not supported.

export const runtime = "edge";

export default async function SearchPage({
  params,
}: {
  params: { q: string };
}) {
  const tracks = await searchTrack(decodeURIComponent(params.q));
  return (
    <div className="flex flex-col gap-4">
      <span>เลือกรายการเพลงที่ต้องการส่งคำขอ</span>
      <div className="flex flex-col md:flex-row md:flex-wrap gap-4 md:gap-8">
        {tracks.map((track) => (
          <SongRequestItem key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
}
