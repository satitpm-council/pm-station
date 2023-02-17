import { withAuth } from "@/utils/api";
import _drive from "@/utils/gdrive";
import { drive_v3 } from "@googleapis/drive";
import { NextApiHandler } from "next";

const folderId = "12oXCS-KyoDcJjU4E-WKZFRHJeIT-M6XV";

type DriveImageFile = Required<
  Pick<
    drive_v3.Schema$File,
    "id" | "name" | "createdTime" | "webViewLink" | "thumbnailLink"
  >
> & {
  imageMediaMetadata: Pick<
    NonNullable<drive_v3.Schema$File["imageMediaMetadata"]>,
    "width" | "height" | "time"
  >;
};

const getPendingImages: NextApiHandler = async (req, res) => {
  try {
    // List all images in the Google Drive folder
    const drive = await _drive();
    // Call the Drive API to list all files in the folder
    const files = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/'`,
      fields:
        "nextPageToken, files(id, name, createdTime, webViewLink, thumbnailLink, imageMediaMetadata(width, height, time))",
    });

    res.status(200).json({ files: files.data.files });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default getPendingImages;
