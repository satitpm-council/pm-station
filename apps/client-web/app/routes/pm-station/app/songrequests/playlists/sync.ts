import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { DriveSync } from "~/utils/pm-station/drive";

export const loader: LoaderFunction = async ({ request }) => {
  const searchParams = new URL(request.url).searchParams;
  const date = searchParams.get("date");
  const folderId = searchParams.get("folderId");
  if (!date || !folderId) {
    return json({ success: false, error: "bad-request" }, 400);
  }
  const sync = new DriveSync();
  await sync.initialize();
  return json(await sync.listFiles(folderId, date));
};
