import { CloudinaryImage } from "@/components/Image";
import ImageDialog from "@/components/ImageDialog";
import { DriveImageFile, ImageFile } from "@/types/image";
import _drive from "@/utils/gdrive";
import getBase64ImageUrl from "@/utils/generateBlurPlaceholder";
import { sessionOptions, User } from "@/utils/session";
import { ShareIcon } from "@heroicons/react/24/outline";
import { withIronSessionSsr } from "iron-session/next";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useCallback, useRef, useState } from "react";
import { Transition } from "@headlessui/react";
import Head from "next/head";
import { googleThumbnail } from "@/utils/image.client";

const folderId = "12oXCS-KyoDcJjU4E-WKZFRHJeIT-M6XV";

type Props = {
  user: User;
  files: DriveImageFile[];
};

export const getServerSideProps: GetServerSideProps<Props> = withIronSessionSsr(
  // @ts-ignore
  async (ctx) => {
    if (!ctx.req.session.user || !ctx.req.session.user.studentId) {
      console.log("no user or no studentId", ctx.req.session.user, ctx.query);
      if (ctx.query?.code && typeof ctx.query.code === "string") {
        // maybe from swtiching browsers. let's restart the flow.
        const params = new URLSearchParams();
        params.append("code", ctx.query.code);
        if (ctx.query?.uid && typeof ctx.query.uid === "string") {
          params.append("uid", ctx.query.uid);
        }
        return {
          redirect: {
            destination: `/farewell/api/code?${params.toString()}`,
          },
        };
      }
      return {
        redirect: {
          destination: "/farewell",
        },
      };
    }
    try {
      const drive = await _drive();
      // Search for the folder with the given name
      const studentId = ctx.req.session.user.studentId;
      const { data: folder } = await drive.files.list({
        q: `name contains '${studentId}' and '${folderId}' in parents and mimeType = 'application/vnd.google-apps.folder'`,
        fields: "files(id, name)",
      });
      // Call the Drive API to list all image files in the folder
      const allImagesList = folder.files
        ? folder.files
            .map(async (v) => {
              const files = (
                await drive.files.list({
                  q: `'${v.id}' in parents and mimeType contains 'image/'`,
                  fields: "files(id, name, createdTime, thumbnailLink)",
                  orderBy: "createdTime",
                })
              ).data.files as DriveImageFile[];
              return await Promise.all(
                files.map(async (file) => ({
                  ...file,
                  blurDataUrl: await getBase64ImageUrl(
                    googleThumbnail(file.thumbnailLink, 8)
                  ),
                }))
              );
            })
            .flat(2)
        : [];
      return {
        props: {
          files: (await Promise.all(allImagesList)).flat(),
          user: ctx.req.session.user,
        },
      };
    } catch (error) {
      console.error(error);
      return { props: { files: [] }, user: ctx.req.session.user };
    }
  },
  sessionOptions
);

const ImagesModal = () => {
  const { data: images } = useSWR<ImageFile[] | undefined>("/images", {
    revalidateOnMount: false,
    revalidateOnFocus: false,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    revalidateOnReconnect: false,
  });
  return <ImageDialog images={images} />;
};

const ShareButton = ({ user }: Pick<Props, "user">) => {
  const [show, setShow] = useState(false);
  const transitionRef = useRef<NodeJS.Timeout>();

  const onClick = useCallback(() => {
    navigator.clipboard.writeText(
      `${window.location.origin}/farewell/share?code=${user.uid}`
    );
    setShow(true);
    transitionRef.current = setTimeout(() => {
      setShow(false);
    }, 3000);
  }, [user.uid]);
  return (
    <div className="flex-shrink-0 flex flex-col items-center justify-center">
      <button
        onClick={onClick}
        className="flex flex-row pointer z-10 mt-6 rounded-lg border border-white bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/10 hover:text-white md:mt-4"
      >
        <ShareIcon className="h-5 w-5 mr-2" />
        <span>แชร์อัลบั้มรูปภาพ</span>
      </button>
      <Transition
        as="span"
        className="text-sm py-4 text-red-500"
        show={show}
        enter="transition ease-out duration-500"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-500"
        leaveTo="transform opacity-0 scale-95"
      >
        คัดลอกลิงก์แล้ว
      </Transition>
    </div>
  );
};

export default function ImagesViewPage({ files, user }: Props) {
  const router = useRouter();
  const { photoId } = router.query;

  return (
    <main className="mx-auto max-w-[1960px] p-4 space-y-6">
      <Head>
        <title>รายการรูป Photobooth : PM Farewell 64&67</title>
      </Head>
      {photoId && <ImagesModal />}
      <div className="after:content relative col-span-1 row-span-3 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 lg:gap-10 overflow-hidden rounded-lg bg-white/10 px-6 py-8 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight">
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
          <h1 className="text-2xl font-bold uppercase">
            ยินดีต้อนรับ {user.displayName}
          </h1>
          <div className="max-w-[40ch] space-y-2 text-sm text-white/75">
            <p>
              คณะกรรมการนักเรียนประจำปีการศึกษา 2565
              ขอร่วมแสดงความยินดีกับการจบการศึกษาของนักเรียนชั้น ม.{user.level}{" "}
              ทุกคน
            </p>
            <p>
              คุณสามารถเลือกดูรายการรูปที่ถ่ายในซุ้ม Photobooth ได้ด้านล่าง
              และสามารถใส่กรอบเฟรมเพิ่มเติมที่เป็นเอกลักษณ์ของแต่ละรูปได้อีกด้วย
            </p>
          </div>
        </div>
        <ShareButton user={user} />
        <div className="absolute right-0 top-0 p-6 z-10">
          <Link href="/farewell/api/logout" title="Logout">
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {files.map((v, i) => (
          <Link
            key={v.id}
            href={{
              query: { photoId: i },
            }}
            shallow
            className="after:content group relative cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
          >
            <CloudinaryImage file={v} />
          </Link>
        ))}
      </div>
    </main>
  );
}
