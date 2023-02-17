import { DriveImageFile } from "@/types/image";
import _drive from "@/utils/gdrive";
import { GetServerSideProps, NextApiHandler } from "next";
import Image from "next/image";
import Link from "next/link";

const folderId = "12oXCS-KyoDcJjU4E-WKZFRHJeIT-M6XV";

type Props = {
  files: DriveImageFile[];
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  try {
    // List all images in the Google Drive folder
    const drive = await _drive();
    // Call the Drive API to list all files in the folder
    const { data } = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/'`,
      fields:
        "files(id, name, createdTime, webViewLink, thumbnailLink, imageMediaMetadata(width, height, time))",
    });

    return { props: { files: data.files as DriveImageFile[] } };
  } catch (error) {
    console.error(error);
    return { props: { files: [] } };
  }
};

export default function PendingImagesPage({ files }: Props) {
  return (
    <main>
      <h1>เลือกรูปภาพ</h1>
      <div className="relative py-4 flex flex-wrap gap-4">
        {files.map((v) => (
          <Link
            key={v.id}
            className="rounded bg-white shadow-md flex flex-col gap-2 border p-4"
            href={`/admin/images/editor/${v.id}`}
          >
            <div>
              <Image
                className="rounded"
                src={v.thumbnailLink}
                width={220}
                height={147}
                alt={v.name}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-black">{v.name}</h2>
              <p className="text-sm text-gray-500">
                {v.imageMediaMetadata.width} x {v.imageMediaMetadata.height}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
