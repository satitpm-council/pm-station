import { PageHeader } from "@/components/layout/PageHeader";
import { Metadata } from "next";
import SearchForm from "./SearchForm";

export const metadata: Metadata = {
  title: "ส่งคำขอเพลง",
};

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
