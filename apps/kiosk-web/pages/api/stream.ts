import { NextApiHandler } from "next";
import ytdl from "ytdl-core";

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
  const videoId = req.query.v;
  res.setHeader("Cache-Control", "private,no-cache,max-age=0");
  if (videoId && typeof videoId === "string" && ytdl.validateID(videoId)) {
    ytdl(videoId, { quality: "highestaudio", filter: "audioonly" })
      .on("info", (info: ytdl.videoInfo, format: ytdl.videoFormat) => {
        console.log(format);
        // Set any neccessary headers!
        format.mimeType && res.setHeader("Content-Type", format.mimeType);
        res.setHeader("Content-Length", format.contentLength);
      })
      .pipe(res);
    return;
  }

  return res.status(400).json({ success: false, message: "Bad Request" });
};

export default handler;
