import { SongRequestItem } from "@/components/music-interactions";
import { listSongRequests } from "@/features/songrequests";

export default async function SongRequestSubmissionList() {
  const submissions = await listSongRequests();
  return (
    <div className="flex flex-col md:flex-row md:flex-wrap gap-4 md:gap-8">
      {submissions.map((track) => (
        <SongRequestItem key={track.id} data={track} />
      ))}
    </div>
  );
}
