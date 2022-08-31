import { Form, useTransition } from "@remix-run/react";
import { SubmitButton } from "~/components/SubmitButton";
import type { UserClaims } from "~/utils/pm-station/auth.server";
import { useUser, withTitle } from "~/utils/pm-station/client";

export const meta = withTitle("ข้อมูลส่วนตัว");

const typeRadio: Record<UserClaims["type"], string> = {
  guest: "บุคคลภายนอก",
  student: "นักเรียน",
  teacher: "อาจารย์",
};

export default function Profile() {
  const transition = useTransition();
  const { user, isRegistered } = useUser();
  return (
    <>
      <h1 className="text-3xl xl:text-4xl font-bold">
        {isRegistered ? "ข้อมูลส่วนตัว" : "ลงทะเบียน"}
      </h1>
      {!isRegistered && (
        <span className="text-sm text-gray-300">
          กรุณาลงทะเบียนก่อนเข้าใช้งาน
        </span>
      )}
      <Form
        autoComplete="off"
        method="post"
        className="grid grid-cols-[max-content_1fr] items-center gap-4 text-sm"
      >
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
              />
              <label htmlFor={type}>{value}</label>
            </div>
          ))}
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
