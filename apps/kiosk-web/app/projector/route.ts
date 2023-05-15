import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getTodayPlaylist } from "kiosk-socket/utils";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Bangkok");

export const GET = async (request: NextRequest) => {
  const playlist = await getTodayPlaylist().catch(() => undefined);
  if (playlist) {
    const now = dayjs.tz(dayjs());
    const url = request.nextUrl.clone();
    const showProgram = !now.isBefore(playlist.queuedDate);
    url.pathname = showProgram ? "/projector/program" : "/projector/landing";
    return NextResponse.redirect(url);
  } else {
    return new Response("Not found", { status: 404 });
  }
};
