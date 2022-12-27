import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useActionData, useCatch, useSubmit } from "@remix-run/react";
import { captureException } from "@sentry/remix";
import { useEffect } from "react";
import { getFormData } from "@station/shared/api";
import { isFirebaseError } from "@station/client/firebase";
import type {
  SelectTrackAction,
  SelectTrackActionResponse,
} from "@station/shared/api";
import { verifyCSRFToken } from "@station/server/auth/remix";
import { getTrack, selectTrack } from "~/utils/pm-station/spotify/index.server";

export const action: ActionFunction = async ({ request }) => {
  const { sessionToken, trackId } = await getFormData<SelectTrackAction>(
    request
  );
  if (!trackId || !sessionToken) {
    return redirect("/pm-station/app/songrequests");
  }
  try {
    const user = await verifyCSRFToken(request);
    const track = await getTrack(trackId);
    await selectTrack(user.uid, track);
    return json<SelectTrackActionResponse>({
      success: true,
      track,
    });
  } catch (err) {
    console.error(err);
    captureException(err);
    throw json<SelectTrackActionResponse>(
      {
        success: false,
        code: isFirebaseError(err) ? err.code : (err as Error).message,
      },
      400
    );
  }
};

export default function Result() {
  const submit = useSubmit();
  const { track } = useActionData<SelectTrackActionResponse>() ?? {};
  useEffect(() => {
    if (!track) {
      submit(null, {
        action: "/pm-station/app/songrequests",
      });
    }
  }, [track, submit]);
  if (!track) return null;
  return (
    <div className="my-4 flex flex-col gap-6 md:w-full max-w-2xl transform rounded-xl bg-stone-800 px-6 sm:px-8 py-8 shadow-xl transition-all text-white">
      <h3 className="text-2xl font-bold text-center">
        ส่งคำขอเพลงเรียบร้อยแล้ว
      </h3>
      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center gap-6 lg:gap-8">
        <div className={`flex-shrink-0 md:basis-1/2 max-w-[200px] relative`}>
          <img
            draggable={false}
            src={track?.albumImage?.url}
            alt={`${track?.name} - ${track?.artists[0]}`}
          />
        </div>
        <div className="flex flex-col items-center sm:items-start md:items-center lg:items-start gap-6 text-center sm:text-left md:text-center lg:text-left">
          <div className="flex flex-col gap-3">
            <h3 className="text-2xl font-medium line-clamp">{track?.name}</h3>
            <span className="text-sm">{track?.artists.join("/")}</span>
          </div>

          <div>
            <Link
              to={"/pm-station/app"}
              className={`
  text-sm pm-station-btn bg-green-500 hover:bg-green-600 pm-station-focus-ring focus:ring-green-500`}
            >
              กลับไปยังหน้าแรก
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export const CatchBoundary = () => {
  const caught = useCatch();
  const { code } = caught.data as SelectTrackActionResponse;
  return (
    <div className="flex flex-col gap-4 items-center justify-center text-center">
      <h4 className="font-bold text-lg">ไม่สามารถเลือกเพลงได้</h4>
      <span>
        กรุณาบันทึกภาพหน้าจอนี้และแจ้งไปยังคณะกรรมการนักเรียนเพื่อดำเนินการแก้ไข
      </span>
      <pre className="bg-white bg-opacity-10 rounded-lg p-4 text-left">
        <code>{JSON.stringify({ status: caught.status, code }, null, 2)}</code>
      </pre>
    </div>
  );
};
