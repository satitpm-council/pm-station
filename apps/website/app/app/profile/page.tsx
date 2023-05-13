import { headers } from "next/headers";
import { PageHeader } from "@station/client/layout";
import { getSession } from "@/auth/server";
import { getCSRFToken } from "@/auth/csrf";
import ProfileForm from "./Form";

export default async function Profile() {
  const csrfToken = getCSRFToken(headers());
  const { isRegistered, user } = await getSession();
  return (
    <>
      <PageHeader title={isRegistered ? "ข้อมูลส่วนตัว" : "ลงทะเบียน"}>
        {!isRegistered && "กรุณาลงทะเบียนก่อนเข้าใช้งาน"}
      </PageHeader>
      <ProfileForm user={user} csrfToken={csrfToken} />
    </>
  );
}
