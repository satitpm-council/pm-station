import { PageHeader } from "@/components/layout/PageHeader";
import { TrackModal } from "@/components/music-interactions";
import { Metadata } from "next";
import SongRequestSubmissionList from "./list";
import { ViewSongRequestModal } from "./ViewModal";

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
      <ViewSongRequestModal />
      {/** @ts-expect-error Async component */}
      <SongRequestSubmissionList />
    </>
  );
}
