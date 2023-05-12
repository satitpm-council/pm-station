import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { PageHeader } from "@station/client/layout";
import options from "@/auth";
import { getCSRFToken } from "@/auth/csrf";
import ProfileForm from "./Form";

export default async function Profile() {
  const csrfToken = getCSRFToken(headers());
  const session = await getServerSession(options);
  const isRegistered = !!session?.user?.type;
  return (
    <>
      <PageHeader title={isRegistered ? "ข้อมูลส่วนตัว" : "ลงทะเบียน"}>
        {!isRegistered && "กรุณาลงทะเบียนก่อนเข้าใช้งาน"}
      </PageHeader>
      <ProfileForm user={session?.user} csrfToken={csrfToken} />
    </>
  );
}
