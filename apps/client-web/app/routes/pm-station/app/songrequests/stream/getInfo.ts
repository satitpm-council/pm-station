import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getMusicInfo } from "~/utils/pm-station/ytmusic";
import { headers, withEditorAuth } from ".";

const getInfo: LoaderFunction = async ({ request }) => {
  const params = new URL(request.url).searchParams;
  const v = params.getAll("v");
  if (v.length === 0) {
    return json({ success: false }, { headers, status: 400 });
  }
  try {
    return json({ success: true, data: await getMusicInfo(...v) }, { headers });
  } catch (err) {
    console.error(err);
    return json({ success: false }, { headers, status: 500 });
  }
};

export const loader = withEditorAuth(getInfo);
