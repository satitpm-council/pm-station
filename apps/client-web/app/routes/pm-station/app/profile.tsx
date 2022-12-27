import type { ActionFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";
import { PageHeader } from "@station/client/layout";
import { SubmitButton } from "@station/client/SubmitButton";
import { getFormData } from "@station/shared/api";
import type { ActionResponse } from "@station/shared/api";
import type { User, UserClaims } from "~/utils/pm-station/client";
import { UserRole } from "~/utils/pm-station/client";
import { verifySession, updateProfile } from "@station/server/auth/remix";
import { useUser, withTitle } from "~/utils/pm-station/client";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const meta = withTitle("ข้อมูลส่วนตัว");

const typeRadio: Record<UserClaims["type"], string> = {
  student: "นักเรียน",
  teacher: "อาจารย์",
  guest: "บุคคลภายนอก",
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const user = await verifySession(request);
    const { displayName, type, role } = await getFormData<User>(request);
    if (!user || !displayName || !type)
      throw new Error("Missing required parameters.");
    const headers = {
      "Set-Cookie": await updateProfile(request, user?.uid, {
        displayName,
        type,
        role: role ?? UserRole.USER,
      }),
    };
    if (user.role !== undefined && user.type) {
      // user already registered, display a success message
      return json<ActionResponse>(
        { success: true },
        {
          headers,
        }
      );
    }
    return redirect("/pm-station/app", { headers });
  } catch (err) {
    console.error(err);
    return json<ActionResponse>({ success: false, error: "bad-request" }, 400);
  }
};

export default function Profile() {
  const { success, error } = useActionData<ActionResponse>() ?? {};
  const transition = useTransition();
  const { user, isRegistered } = useUser();
  useEffect(() => {
    if (success !== undefined) {
      toast(
        <>
          <b>ปรับปรุงข้อมูล{success ? "เรียบร้อยแล้ว" : "ไม่สำเร็จ"}</b>
          {!success && error && <span>เนื่องจาก {error}</span>}
        </>,
        {
          type: success ? "success" : "error",
        }
      );
    }
  }, [success, error]);
  return (
    <>
      <PageHeader title={isRegistered ? "ข้อมูลส่วนตัว" : "ลงทะเบียน"}>
        {!isRegistered && "กรุณาลงทะเบียนก่อนเข้าใช้งาน"}
      </PageHeader>
      <Form
        autoComplete="off"
        method="post"
        className="space-y-4 sm:py-2 text-sm"
      >
        <div className="grid sm:grid-cols-[max-content_1fr] items-center gap-4">
          <label htmlFor="phoneNumber" className="mr-4">
            เบอร์โทรศัพท์:
          </label>
          <input
            type="text"
            disabled
            className="pm-station-input"
            defaultValue={user?.phoneNumber}
            name="phoneNumber"
            title="เบอร์โทรศัพท์"
            autoComplete="off"
          />
          <label htmlFor="displayName" className="font-bold">
            ชื่อ:
          </label>
          <input
            type="text"
            disabled={transition.state === "submitting"}
            defaultValue={user?.displayName}
            name="displayName"
            autoComplete="off"
            title="ชื่อ"
            placeholder="ป้อนชื่อและนามสกุล"
            required
          />
          <label htmlFor="type" className="self-start py-1 sm:self-center">
            ประเภทบุคคล:
          </label>
          <div className="flex flex-row flex-wrap gap-4 sm:gap-6 pb-2 sm:py-1">
            {Object.entries(typeRadio).map(([type, value]) => (
              <div className="flex gap-2 items-center" key={type}>
                <input
                  required
                  type="radio"
                  name="type"
                  value={type}
                  title="ประเภทบุคคล"
                  id={type}
                  defaultChecked={user?.type === type}
                  className="-mt-1"
                  disabled={transition.state === "submitting"}
                />
                <label htmlFor={type}>{value}</label>
              </div>
            ))}
          </div>
        </div>
        <SubmitButton
          className="sm:my-2"
          loading={transition.state === "submitting"}
        >
          บันทึกข้อมูล
        </SubmitButton>
      </Form>
    </>
  );
}
