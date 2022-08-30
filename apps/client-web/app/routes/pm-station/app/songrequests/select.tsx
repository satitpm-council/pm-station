import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useCatch } from "@remix-run/react";
import { getFormData } from "~/utils/api";
import type { SelectTrackAction } from "~/utils/pm-station/api-types";
import { isFirebaseError, verifyIdToken } from "~/utils/pm-station/auth.server";
import type { TrackResponse } from "~/utils/pm-station/spotify/index.server";
import {
  getTrack,
  selectTrack,
  toTrackResponse,
} from "~/utils/pm-station/spotify/index.server";

type SelectTrackActionResponse = {
  success: boolean;
  track?: TrackResponse;
  code?: string;
};

export const action: ActionFunction = async ({ request }) => {
  const { token, trackId } = await getFormData<SelectTrackAction>(request);
  if (!trackId || !token) {
    return redirect("/pm-station/app/songrequests");
  }
  try {
    const user = await verifyIdToken(request.headers, token);
    const track = await getTrack(trackId);
    await selectTrack(user.sub, track);
    return json<SelectTrackActionResponse>({
      success: true,
      track: toTrackResponse(track),
    });
  } catch (err) {
    console.error(err);
    throw json<SelectTrackActionResponse>(
      {
        success: false,
        code: isFirebaseError(err) ? err.code : (err as Error).message,
      },
      400
    );
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  if (request.method === "post") {
    return json({});
  }
  return redirect("/pm-station/app/songrequests");
};

export default function Result() {
  const data = useActionData();
  console.log(data);
  return <>Result</>;
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
