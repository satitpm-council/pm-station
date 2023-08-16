import { headers } from "next/headers";
import { PageHeader } from "@/components";
import { getSession } from "@/auth/server";
import { getCSRFToken } from "@/auth/csrf";
import ProfileForm from "./Form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ข้อมูลส่วนตัว",
};

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
