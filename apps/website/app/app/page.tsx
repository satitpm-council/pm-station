"use client";
import { ActionBox } from "./ActionBox";
import { MusicalNoteIcon } from "@heroicons/react/20/solid";

export default function Page() {
  return (
    <>
      <h1 className="text-4xl xl:text-5xl font-bold">PM Station</h1>
      <div className="grid sm:grid-cols-2 md:flex flex-row flex-wrap gap-6 py-4">
        <ActionBox
          header="ส่งคำขอ PM Music Request"
          href="/app/songrequests"
          icon={MusicalNoteIcon}
          className="bg-purple-500"
        >
          ส่งคำขอสำหรับเปิดเพลงในรายการ
        </ActionBox>
      </div>
    </>
  );
}
