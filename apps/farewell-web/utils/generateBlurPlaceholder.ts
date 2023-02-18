// @ts-ignore
import imagemin from "imagemin";
// @ts-ignore
import imageminJpegtran from "imagemin-jpegtran";
import type { ImageApiFile } from "../types/image";

const cache = new Map<string, string>();

export default async function getBase64ImageUrl(
  image: ImageApiFile | string
): Promise<string> {
  const fetchUrl =
    typeof image === "string"
      ? image
      : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_jpg,w_8,q_70/${image.public_id}.${image.format}`;
  let url = cache.get(fetchUrl);
  if (url) {
    return url;
  }
  const response = await fetch(fetchUrl);
  const buffer = await response.arrayBuffer();
  const minified = await imagemin.buffer(Buffer.from(buffer), {
    plugins: [imageminJpegtran()],
  });

  url = `data:image/jpeg;base64,${Buffer.from(minified).toString("base64")}`;
  cache.set(fetchUrl, url);
  return url;
}
