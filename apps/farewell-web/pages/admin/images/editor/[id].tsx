import { GetServerSideProps } from "next";
import drive from "@/utils/gdrive";
import { DriveImageFile, ImageFile } from "@/types/image";
import cloudinary from "@/utils/cloudinary";
import { ResourceApiResponse } from "cloudinary";
import SharedModal from "@/components/ImageModal";
import { useState } from "react";
import getBase64ImageUrl from "@/utils/generateBlurPlaceholder";
import { googleThumbnail } from "@/utils/image.client";

type Props = {
  file: DriveImageFile;
  frames: ImageFile[];
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params ?? {};
  if (!id || typeof id !== "string") {
    return {
      notFound: true,
    };
  }
  // get the image from google drive
  const { files } = await drive();
  const { data } = await files.get({
    fileId: id,
    fields:
      "id, name, createdTime, webViewLink, thumbnailLink, imageMediaMetadata(width, height, time)",
  });

  const { resources }: ResourceApiResponse = await cloudinary.v2.search
    .expression(`folder:"farewell/frames/*"`)
    .sort_by("public_id", "asc")
    .execute();

  const imagesWithBlurDataUrls = await Promise.all(
    resources.map((v) => getBase64ImageUrl(v as any))
  );

  return {
    props: {
      file: data,
      frames: resources.map(({ public_id, height, width, format }, i) => ({
        id: i,
        public_id,
        width,
        height,
        format,
        blurDataUrl: imagesWithBlurDataUrls[i],
      })),
    },
  };
};

export default function PhotoEditor({ file, frames }: Props) {
  const [frameIndex, setFrameIndex] = useState(0);
  return (
    <main>
      <div className="flex flex-col items-center justify-center">
        <div className="select-none w-full max-w-4xl">
          <SharedModal
            changePhotoId={setFrameIndex}
            index={frameIndex}
            closeModal={() => {}}
            navigation
            images={frames}
            backgroundImage={googleThumbnail(file.thumbnailLink, 1280)}
          />
        </div>
      </div>
    </main>
  );
}
