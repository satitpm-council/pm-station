import { PageHeader } from "@/components/layout/PageHeader";
import { Metadata } from "next";
import SearchForm from "./SearchForm";

export const metadata: Metadata = {
  title: "ส่งคำขอเพลง",
};

// Select the runtime for the song requests search feature.
// The edge runtime has been tested on the Spotify engine only.
// YouTube Music engine is not supported.

// export const runtime = "edge";

export default function SongRequestUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader title={"PM Music Request"}>
        ส่งคำขอเพลงสำหรับเปิดในรายการ
      </PageHeader>
      <SearchForm />
      {children}
    </>
  );
}
