import { NextApiHandler } from "next";
import axios from "axios";

export const config = {
  api: {
    externalResolver: true,
  },
};

const download: NextApiHandler = async (req, res) => {
  const { url, filename } = req.query;
  if (typeof url !== "string" || typeof filename !== "string") {
    return res.status(400).end("Bad Request");
  }
  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
  try {
    const { data } = await axios.get(url, {
      responseType: "stream",
    });
    data.pipe(res);
  } catch (err) {
    res.status(500).end("Internal Server Error");
  }
};

// we can't even use session checking, because the download might happens in another browser
// (like the native mobile browser).
export default download;
