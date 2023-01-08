"use client";

import Image from "next/image";
import Time from "./components/time";

export default function ProgramProjector() {
  return (
    <div className="flex-1 flex-col flex">
      <header className="flex flex-row border-b border-gray-300">
        <div className="flex-grow flex flex-row gap-8 px-12 py-6 items-center">
          <Image
            src="/coolkidssatit.png"
            alt="logo sc"
            width={100}
            height={100}
          />
          <b>PM Station</b>
        </div>
        <div className="border-l px-10 py-6 flex items-center">
          <Time />
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center gap-8 p-14 flex-grow">
        <span>ขณะนี้คุณกำลังรับฟังรายการ</span>
        <h2 className="text-6xl font-bold">อะไรกันครับเนี่ย</h2>
        <span className="text-3xl opacity-75">
          ทุกวันพุธ เวลา 07:00 - 07:40 น.
        </span>
        <div className="flex flex-col gap-4 p-10 text-2xl text-center">
          <h3 className="text-3xl font-medium">ดำเนินรายการโดย:</h3>
          <ul className="leading-10">
            <li>นางสาวเอ นามสกุลไม่มี</li>
            <li>นางสาวบี นามสกุลเดี๋ยวก็มี</li>
            <li>นางสาวซี นามสกุลไม่พึงมี</li>
          </ul>
          <span className="opacity-75">นักเรียนชั้นมัธยมศึกษาปีที่ 8/1</span>
        </div>
      </main>
      <footer className="relative py-10 px-14 w-full bg-zinc-800 text-white text-center flex flex-row">
        <div className="flex flex-col text-left gap-2 flex-grow text-2xl">
          <p className="">
            ดำเนินการโดย คณะกรรมการนักเรียนฝ่ายเทคโนโลยีสารสนเทศ ประจำปีการศึกษา
            2565
          </p>
          <span>IG: @coolkidssatit</span>
        </div>
        <div className="mr-[320px] text-right flex flex-col gap-3 items-end">
          <b className="text-3xl">สามารถส่งคำขอเพลงเข้าสู่รายการได้ที่</b>
          <span className="text-2xl">
            https://coolkidssatit.fly.dev/pm-station
          </span>
        </div>
        <div className="text-6xl absolute right-0 bottom-0 bg-white text-black p-4">
          <Image
            className="object-cover"
            width="300"
            height="300"
            src="/web-qr.svg"
            alt="QR Code"
          />
        </div>
      </footer>
    </div>
  );
}
