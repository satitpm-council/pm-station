import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { isString } from "~/utils/guards";
import { searchTrack } from "~/utils/spotify/search";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  if (isString(q)) {
    try {
      return json(await searchTrack(q));
    } catch (err) {
      console.error(err);
      return json({ success: false }, 500);
    }
  }
  return json({ success: false }, 400);
};
