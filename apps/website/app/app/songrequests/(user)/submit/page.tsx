import { submitSongRequest } from "@/features/songrequests";
import { getTrack } from "@/music-engine/spotify";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function SongRequestSubmitPage({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const { id } = searchParams ?? {};
  if (typeof id !== "string") {
    return redirect("/app/songrequests");
  }
  const track = await getTrack(id);
  await submitSongRequest(track);
  return (
    <div className="my-4 flex flex-col gap-6 md:w-full max-w-2xl transform rounded-xl bg-stone-800 px-6 sm:px-8 py-8 shadow-xl transition-all text-white">
      <h3 className="text-2xl font-bold text-center">
        ส่งคำขอเพลงเรียบร้อยแล้ว
      </h3>
      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center gap-6 lg:gap-8">
        <div className={`flex-shrink-0 md:basis-1/2 max-w-[200px] relative`}>
          <Image
            draggable={false}
            src={track?.thumbnail_url}
            alt={`${track?.title} - ${track?.artists[0]}`}
            width={track?.thumbnail_width}
            height={track?.thumbnail_height}
          />
        </div>
        <div className="flex flex-col items-center sm:items-start md:items-center lg:items-start gap-6 text-center sm:text-left md:text-center lg:text-left">
          <div className="flex flex-col gap-3">
            <h3 className="text-2xl font-medium line-clamp">{track?.title}</h3>
            <span className="text-sm">{track?.artists.join("/")}</span>
          </div>

          <div>
            <Link
              href={"/app"}
              className={`text-sm pm-station-btn bg-green-500 hover:bg-green-600 pm-station-focus-ring focus:ring-green-500`}
            >
              กลับไปยังหน้าแรก
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
