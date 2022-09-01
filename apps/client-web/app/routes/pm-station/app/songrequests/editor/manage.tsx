import { PageHeader } from "~/components/Header";
import { withTitle } from "~/utils/pm-station/client";

export const meta = withTitle("หน้าหลัก");

export default function ManageSongRequest() {
  return (
    <>
      <PageHeader title={"จัดการคำขอเพลง"}>
        จัดการคำขอเพลงสำหรับเปิดในช่วง PM Music Request
      </PageHeader>
    </>
  );
}
