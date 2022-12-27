import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { verifySession } from "@station/server/auth/remix";
import { UserRole } from "~/utils/pm-station/client";
import { DriveSync } from "~/utils/pm-station/drive";

export const headers = {
  "Cache-Control": "private,no-store,max-age=0",
};

export const withEditorAuth = (handler: LoaderFunction): LoaderFunction => {
  return async (args) => {
    const user = await verifySession(args.request);
    if (user?.role && user?.role >= UserRole.EDITOR) {
      return handler(args);
    }
    return json({ success: false }, { headers, status: 401 });
  };
};

const syncHandler: LoaderFunction = async ({ request }) => {
  const searchParams = new URL(request.url).searchParams;
  const date = searchParams.get("date");
  const folderId = searchParams.get("folderId");
  if (!date || !folderId) {
    return json({ success: false, error: "bad-request" }, 400);
  }
  const sync = new DriveSync();
  await sync.initialize();
  return json(await sync.listFiles(folderId, date), { headers });
};

export const loader = withEditorAuth(syncHandler);
