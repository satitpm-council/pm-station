import { PageHeader } from "@/components/layout/PageHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "จัดการผู้ใช้งาน",
};

// export const runtime = "edge";

export default function UserManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader title={"จัดการผู้ใช้งาน"}>
        จัดการผู้ใช้งานในระบบจัดการคำขอเพลง PM Station
      </PageHeader>
      {children}
    </>
  );
}
