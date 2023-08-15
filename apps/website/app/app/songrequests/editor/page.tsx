import { PageHeader } from "@/components/layout/PageHeader";
import { Metadata } from "next";
import SongRequestSubmissionList from "./list";

export const metadata: Metadata = {
  title: "จัดการคำขอเพลง",
};

export const runtime = "edge";

export default function SongRequestEditor() {
  return (
    <>
      <PageHeader title={"จัดการคำขอเพลง"}>
        จัดการคำขอเพลงสำหรับเปิดในช่วง PM Music Request
      </PageHeader>
      {/** @ts-expect-error Async component */}
      <SongRequestSubmissionList />
    </>
  );
}
