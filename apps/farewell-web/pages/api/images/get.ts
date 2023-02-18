import { ImageApiFile } from "@/types/image";
import cloudinary from "@/utils/cloudinary";
import drive from "@/utils/gdrive";
import { ResourceApiResponse, UploadApiResponse } from "cloudinary";
import { NextApiHandler } from "next";

const returnImageFile = (
  {
    public_id,
    width,
    height,
    format,
  }: ResourceApiResponse["resources"][0] | UploadApiResponse,
  fileId: string
): ImageApiFile => {
  return {
    public_id,
    width: width.toString(),
    height: height.toString(),
    format,
    driveId: fileId,
  };
};

const folder = "farewell/images";

export const config = {
  api: {
    externalResolver: true,
  },
};

const handler: NextApiHandler<ImageApiFile | { error: string }> = async (
  req,
  res
) => {
  // Get the drive file ID from search params
  const { fileId } = req.query;
  if (!fileId || typeof fileId !== "string") {
    return res.status(400).json({ error: "Missing fileId or fileName" });
  }

  // Get the file name from Google Drive API.
  const d = await drive();
  const { data: driveFile } = await d.files.get({
    fileId,
    fields: "name,id",
  });

  if (!driveFile) {
    return res.status(404).json({ error: "File not found" });
  }

  // Use the Cloudinary API to search for the file
  const file = await cloudinary.v2.search
    .expression(`folder:${folder} AND public_id:${driveFile.name}`)
    .max_results(1)
    .execute();

  if (file.total_count > 0) {
    return res
      .status(200)
      .json({ ...returnImageFile(file.resources[0], fileId) });
  }

  // File not found. Upload the file to the folder in Cloudinary
  const { data: stream } = await d.files.get(
    { fileId: fileId, alt: "media" },
    { responseType: "stream" }
  );

  const uploadStream = cloudinary.v2.uploader.upload_stream(
    {
      resource_type: "image",
      public_id: driveFile.name as string,
      unique_filename: false,
      folder,
    },
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
      }
      if (result) {
        // Set cache headers to store the response for 10 minutes
        res.setHeader("Cache-Control", "maxage=1800");
        return res.status(200).json(returnImageFile(result, fileId));
      }
    }
  );
  stream.pipe(uploadStream);
};

export default handler;
