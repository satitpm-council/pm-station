import type { ActionFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";
import { PageHeader } from "~/components/Header";
import { SubmitButton } from "~/components/SubmitButton";
import { getFormData } from "~/utils/api";
import type { UpdateProfileActionResponse } from "~/utils/pm-station/api-types";
import type { User, UserClaims } from "~/utils/pm-station/client";
import { UserRole } from "~/utils/pm-station/client";
import { verifySession, updateProfile } from "~/utils/pm-station/auth.server";
import { useUser, withTitle } from "~/utils/pm-station/client";

export const meta = withTitle("ข้อมูลส่วนตัว");

const typeRadio: Record<UserClaims["type"], string> = {
  student: "นักเรียน",
  teacher: "อาจารย์",
  guest: "บุคคลภายนอก",
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const user = await verifySession(request.headers);
    const { displayName, type } = await getFormData<User>(request);
    if (!user || !displayName || !type)
      throw new Error("Missing required parameters.");
    const headers = {
      "Set-Cookie": await updateProfile(request, user?.uid, {
        displayName,
        type,
        role: UserRole.USER,
      }),
    };
    if (user.role && user.type) {
      // user already registered, display a success message
      return json<UpdateProfileActionResponse>(
        { success: true },
        {
          headers,
        }
      );
    }
    return redirect("/pm-station/app", { headers });
  } catch (err) {
    console.error(err);
    return json<UpdateProfileActionResponse>(
      { success: false, error: "bad-request" },
      400
    );
  }
};

export default function Profile() {
  const { success, error } = useActionData<UpdateProfileActionResponse>() ?? {};
  const transition = useTransition();
  const { user, isRegistered } = useUser();
  return (
    <>
      <PageHeader title={isRegistered ? "ข้อมูลส่วนตัว" : "ลงทะเบียน"}>
        {!isRegistered && "กรุณาลงทะเบียนก่อนเข้าใช้งาน"}
      </PageHeader>

      {success !== undefined && transition.state !== "submitting" && (
        <div
          className={`px-6 py-4 text-sm rounded-lg ${
            success ? "bg-green-600 text-green-100" : "bg-red-600 text-red-100"
          } font-normal`}
        >
          <b className="font-medium">
            ปรับปรุงข้อมูล{success ? "เรียบร้อยแล้ว" : "ไม่สำเร็จ"}
          </b>
          {!success && error && <span>เนื่องจาก {error}</span>}
        </div>
      )}
      <Form autoComplete="off" method="post" className="space-y-4 py-2 text-sm">
        <div className="form grid grid-cols-[max-content_1fr] items-center gap-4">
          <label htmlFor="phoneNumber" className="mr-4">
            เบอร์โทรศัพท์:
          </label>
          <input
            type="text"
            disabled
            className="pm-station-input pm-station-btn"
            defaultValue={user?.phoneNumber}
            name="phoneNumber"
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
            required
          />
          <label htmlFor="type" className="self-start py-2 sm:self-center">
            ประเภทบุคคล:
          </label>
          <div className="flex flex-row flex-wrap gap-4 sm:gap-6 py-2 sm:py-1">
            {Object.entries(typeRadio).map(([type, value]) => (
              <div className="flex gap-2 items-center" key={type}>
                <input
                  required
                  type="radio"
                  name="type"
                  value={type}
                  id={type}
                  defaultChecked={user?.type === type}
                  className="-mt-1 form-input"
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
