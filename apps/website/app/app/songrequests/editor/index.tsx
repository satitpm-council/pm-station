import { PageHeader } from "@/components/layout/PageHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "จัดการคำขอเพลง",
};

export const runtime = "edge";

export default function SongRequestEditor({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader title={"จัดการคำขอเพลง"}>
        จัดการคำขอเพลงสำหรับเปิดในช่วง PM Music Request
      </PageHeader>
    </>
  );
}
