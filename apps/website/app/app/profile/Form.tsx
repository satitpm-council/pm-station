"use client";

import { FormEvent, startTransition, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { formData } from "zod-form-data";
import { useRouter } from "next/navigation";

import type { User } from "next-auth";
import { SubmitButton } from "@/components/interactions";
import type { UserType } from "@/schema/user";
import { profileUpdateSchema } from "@/schema/profile";
import { errorToast } from "@/shared/toast";

const typeRadio: Record<UserType, string> = {
  student: "นักเรียน",
  teacher: "อาจารย์",
  guest: "บุคคลภายนอก",
};

export default function ProfileForm({
  user,
  csrfToken,
}: {
  user?: User;
  csrfToken: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Fix radio button not checked after React hydration
  useEffect(() => {
    const type = user?.type;
    if (type) {
      const target = document
        .querySelector("form#profile-form")
        ?.querySelector<HTMLInputElement>(
          `input[name="type"][value="${type}"]`
        );
      if (target) {
        target.checked = true;
      }
    }
  });
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setIsLoading(true);
    try {
      const body = formData(profileUpdateSchema).parse(data);
      await axios.post("/api/auth/session", {
        data: body,
        csrfToken,
      });
    } catch (error) {
      console.error(error);
      errorToast(error, { title: "ปรับปรุงข้อมูลไม่สำเร็จ" });
    } finally {
      setIsLoading(false);
      startTransition(() => {
        router.refresh();
      });
    }
  };
  return (
    <form
      id="profile-form"
      autoComplete="off"
      method="post"
      className="space-y-4 sm:py-2 text-sm"
      onSubmit={handleSubmit}
    >
      <div className="grid sm:grid-cols-[max-content_1fr] items-center gap-4">
        <label htmlFor="email" className="mr-4">
          อีเมล:
        </label>
        <input
          type="text"
          disabled
          className="pm-station-input"
          defaultValue={user?.email ?? undefined}
          name="email"
          title="อีเมล"
          autoComplete="off"
        />
        <label htmlFor="displayName" className="font-bold">
          ชื่อ:
        </label>
        <input
          type="text"
          disabled={isLoading}
          defaultValue={user?.name ?? undefined}
          name="name"
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
                disabled={isLoading}
              />
              <label htmlFor={type}>{value}</label>
            </div>
          ))}
        </div>
      </div>
      <SubmitButton className="sm:my-2" loading={isLoading}>
        บันทึกข้อมูล
      </SubmitButton>
    </form>
  );
}
