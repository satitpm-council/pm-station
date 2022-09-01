import { PageHeader } from "~/components/Header";
import { withTitle } from "~/utils/pm-station/client";

export const meta = withTitle("จัดการคำขอเพลง");

export default function ManageSongRequest() {
  return (
    <>
      <PageHeader title={"จัดการคำขอเพลง"}>
        จัดการคำขอเพลงสำหรับเปิดในช่วง PM Music Request
      </PageHeader>
    </>
  );
}
