import Image from "next/image";
import AnimatedView from "./components/AnimatedView";
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
          <b className="text-4xl">PM Station</b>
        </div>
        <div className="border-l px-10 py-6 flex items-center">
          <Time />
        </div>
      </header>
      <main className="flex-1 flex-grow">
        <AnimatedView />
      </main>
      <footer className="relative py-10 px-14 w-full bg-zinc-800 text-white text-center flex flex-row">
        <div className="flex flex-col text-left gap-2 flex-grow text-2xl">
          <p className="">
            ดำเนินการโดย คณะกรรมการนักเรียนฝ่ายเทคโนโลยีสารสนเทศ ประจำปีการศึกษา
            2565
          </p>
          <span>IG: @coolkidssatit</span>
        </div>
        <div className="mr-[270px] text-right flex flex-col gap-3 items-end">
          <b className="text-3xl">สามารถส่งคำขอเพลงเข้าสู่รายการได้ที่</b>
          <span className="text-2xl">
            https://coolkidssatit.fly.dev/pm-station
          </span>
        </div>
        <div className="text-6xl absolute right-0 bottom-0 bg-white text-black p-4">
          <Image
            className="object-cover"
            width="250"
            height="250"
            src="/web-qr.svg"
            alt="QR Code"
            priority
          />
        </div>
      </footer>
    </div>
  );
}
