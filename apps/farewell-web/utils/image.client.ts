import { DriveImageFile } from "@/types/image";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
export const googleThumbnail = (url: string, size: number) => {
  return url.slice(0, url.lastIndexOf("=")) + "=s" + size;
};

export const exifDate = (file: DriveImageFile) =>
  dayjs(file.imageMediaMetadata.time, "YYYY:MM:dd HH:mm:ss");
