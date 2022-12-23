import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { searchMusic } from "~/utils/pm-station/ytmusic";
import { headers, withEditorAuth } from ".";

const search: ActionFunction = async ({ request }) => {
  const { q } = await request.json();
  if (!Array.isArray(q) || q.length === 0) {
    return json({ success: false }, { headers, status: 400 });
  }
  try {
    return json({ success: true, data: await searchMusic(...q) }, { headers });
  } catch (err) {
    console.error(err);
    return json({ success: false }, { headers, status: 500 });
  }
};

export const action = withEditorAuth(search);
