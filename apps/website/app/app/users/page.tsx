import { PageHeader } from "@/components/layout/PageHeader";
import { listUsers } from "@/features/users";
import { UserTable } from "./table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "จัดการผู้ใช้งาน",
};

export const runtime = "edge";

export default async function UserListPage() {
  const users = await listUsers();
  return (
    <>
      <PageHeader title={"จัดการผู้ใช้งาน"}>
        จัดการผู้ใช้งานในระบบจัดการคำขอเพลง PM Station
      </PageHeader>
      <div className="space-y-4">
        <span className="text-gray-100">
          คลิกที่ข้อมูลผู้ใช้แต่ละแถวเพื่อเรียกดูตัวเลือกเพิ่มเติม
        </span>
        <UserTable data={users} />
      </div>
    </>
  );
}
