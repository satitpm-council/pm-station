import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import YTMusic from "~/utils/pm-station/ytmusic";
import { headers, withEditorAuth } from ".";

const getMusicInfo: LoaderFunction = async ({ request }) => {
  const params = new URL(request.url).searchParams;
  const v = params.getAll("v");
  if (v.length === 0) {
    return json({ success: false }, { headers, status: 400 });
  }
  try {
    const ytmusic = new YTMusic();
    return json(
      { success: true, data: await ytmusic.getMusicInfo(...v) },
      { headers }
    );
  } catch (err) {
    console.error(err);
    return json({ success: false }, { headers, status: 500 });
  }
};

export const loader = withEditorAuth(getMusicInfo);
