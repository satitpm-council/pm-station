import { DriveImageFile, ImageApiFile, ImageFile } from "@/types/image";
import useCloudinaryPhoto from "@/utils/useCloudinaryPhoto";
import { useMemo } from "react";
import { Thumbnail } from "./Thumbnail";

export const toThumbnailUrl = ({ public_id, format }: ImageApiFile) => {
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`;
};

export function CloudinaryImage({
  file,
}: {
  file: Pick<DriveImageFile, "id" | "blurDataUrl">;
}) {
  const { data: image } = useCloudinaryPhoto(file);

  const imageUrl = useMemo(
    () => (image ? toThumbnailUrl(image) : undefined),
    [image]
  );

  return (
    <Thumbnail src={imageUrl} blurDataURL={file.blurDataUrl} alt={"Image"} />
  );
}
