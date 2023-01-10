import { NextApiHandler } from "next";
import ytdl from "ytdl-core";
import { createHeaders } from "@station/server/next/middleware/api/web-fetch";
import { verifySession } from "@station/server/auth";

export const config = {
  api: {
    // NOTE: We didn't deploy this on the serverless environment.
    responseLimit: false,
  },
};

/**
 * Next API Handler to stream the audio from YouTube to the kiosk application.
 */
const handler: NextApiHandler = async (req, res) => {
  // Verify session from cookie headers.
  const session = await verifySession({ headers: createHeaders(req.headers) });
  if (!session) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const videoId = req.query.v;
  if (videoId && typeof videoId === "string" && ytdl.validateID(videoId)) {
    ytdl(videoId, { quality: "highestaudio", filter: "audioonly" })
      .on("info", (info: ytdl.videoInfo, format: ytdl.videoFormat) => {
        console.log(format);
        // Set any neccessary headers!
        res.setHeader("Cache-Control", `private,max-age=${60 * 60}`);
        format.mimeType && res.setHeader("Content-Type", format.mimeType);
        res.setHeader("Content-Length", format.contentLength);
      })
      .pipe(res);
    return;
  }

  res.setHeader("Cache-Control", "private,no-cache,max-age=0");
  return res.status(400).json({ success: false, message: "Bad Request" });
};

export default handler;
