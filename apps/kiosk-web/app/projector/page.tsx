import { redirect, notFound } from "next/navigation";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getTodayPlaylist } from "kiosk-socket/utils";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Bangkok");

export default async function PlayerPage() {
  const playlist = await getTodayPlaylist();
  if (playlist) {
    const now = dayjs.tz(dayjs());
    console.log(playlist);
    if (!now.isBefore(playlist.queuedDate)) {
      redirect("/projector/program");
    } else {
      redirect("/projector/landing");
    }
  } else {
    notFound();
  }
  return null;
}
