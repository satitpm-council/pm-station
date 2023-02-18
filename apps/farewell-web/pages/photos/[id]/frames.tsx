import { CloudinaryImage, Thumbnail, toThumbnailUrl } from "@/components/Image";
import ImageDialog from "@/components/ImageDialog";
import { DriveImageFile, ImageFile } from "@/types/image";
import cloudinary from "@/utils/cloudinary";
import _drive from "@/utils/gdrive";
import getBase64ImageUrl from "@/utils/generateBlurPlaceholder";
import { googleThumbnail } from "@/utils/image.client";
import { sessionOptions, User } from "@/utils/session";
import useCloudinaryPhoto from "@/utils/useCloudinaryPhoto";
import {
  ArrowLeftIcon,
  ArrowRightOnRectangleIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { ResourceApiResponse } from "cloudinary";
import { withIronSessionSsr } from "iron-session/next";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";

type Props = {
  file: DriveImageFile;
  frames: ImageFile[];
};

export const getServerSideProps: GetServerSideProps<Props> = withIronSessionSsr(
  // @ts-ignore
  async (ctx) => {
    if (!ctx.req.session.user || !ctx.req.session.user.studentId) {
      return {
        props: { frames: [] },
        redirect: {
          destination: "/farewell",
        },
      };
    }
    if (!ctx.params?.id) {
      return {
        props: { frames: [] },
        redirect: {
          destination: "/farewell/photos",
        },
      };
    }

    const { resources }: ResourceApiResponse = await cloudinary.v2.search
      .expression(`folder:"farewell/frames/*"`)
      .sort_by("public_id", "asc")
      .execute();

    const imagesWithBlurDataUrls = await Promise.all(
      resources.map((v) => getBase64ImageUrl(v as any))
    );

    // get the image with the given id from Google Drive
    const drive = await _drive();
    const file = (
      await drive.files.get({
        fileId: ctx.params.id as string,
        fields: "id, name, createdTime, thumbnailLink",
      })
    ).data as DriveImageFile;

    return {
      props: {
        frames: resources.map(({ public_id, height, width, format }, i) => ({
          id: i,
          public_id,
          width,
          height,
          format,
          blurDataUrl: imagesWithBlurDataUrls[i],
        })),
        file: {
          ...file,
          blurDataUrl: await getBase64ImageUrl(
            googleThumbnail(file.thumbnailLink, 8)
          ),
        },
      },
    };
  },
  sessionOptions
);

export default function ImagesViewPage({ frames, file }: Props) {
  const router = useRouter();
  const { photoId, id } = router.query;
  const { data: image } = useCloudinaryPhoto(
    id ? { id: id as string } : undefined
  );
  const imagesWithBlurDataUrl = useMemo(
    () =>
      file && image
        ? {
            ...image,
            blurDataUrl: file.blurDataUrl,
          }
        : undefined,
    [image, file]
  );
  return (
    <main className="mx-auto max-w-[1960px] p-4 space-y-6">
      <Head>
        <title>เลือกเฟรมรูป Photobooth : PM Farewell 64&67</title>
      </Head>
      {photoId && (
        <ImageDialog images={frames} backgroundImage={imagesWithBlurDataUrl} />
      )}
      <div className="after:content relative col-span-1 row-span-3 flex flex-col md:flex-row items-center justify-center  gap-2 md:gap-4 lg:gap-10 overflow-hidden rounded-lg bg-white/10 px-6 py-8 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight">
        <div className="absolute inset-0 p-6 z-10">
          <Link title="Back" href="/photos">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <span className="absolute left-0 right-0 bottom-0 h-[400px] bg-gradient-to-b from-black/0 via-black to-black"></span>
        </div>
        <div className="my-[-70px] mx-[-50px] lg:my-[-100px] flex-shrink-0">
          <Image
            src="/logo/FCSHADOW.png"
            alt="FCSHADOW"
            className="object-cover"
            width={300}
            height={300}
            priority
          />
        </div>
        <div className="flex flex-col gap-2 text-left justify-start items-start">
          <h1 className="text-2xl font-bold">เลือกเฟรม Photobooth</h1>
          <div className="space-y-2 text-sm text-white/75">
            <p>
              เลือกดูเฟรมรูป Photobooth ที่ต้องการ และดาวน์โหลดรูปลงบนอุปกรณ์
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {frames.map((v, i) => (
          <Link
            key={v.id}
            href={{
              query: { photoId: i, id },
            }}
            shallow
            className="after:content group relative cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
          >
            <div className={"absolute inset-0 w-full h-full z-10"}>
              <Thumbnail
                blurDataURL={v.blurDataUrl as string}
                src={toThumbnailUrl(v)}
                alt={`Frame ${i}`}
              />
            </div>
            <div>
              <CloudinaryImage file={file} />
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
