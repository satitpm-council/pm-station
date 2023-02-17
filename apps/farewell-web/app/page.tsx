import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow bg-red-800 text-white">
      <Image
        className="-my-10"
        src="/logo/WHITE.png"
        width={300}
        height={300}
        alt="Logo"
      />
      <h1 className="uppercase -mt-10">Photobooth</h1>
      <span className="py-4 text-center leading-8">
        ขณะนี้ยังไม่ถึงเวลาเปิดซุ้มและรับรูปถ่าย กรุณารอสักครู่
        แล้วลองใหม่อีกครั้ง
        <br />
        หากปัญหายังคงเกิดขึ้นอยู่ โปรดติดต่อคณะกรรมการนักเรียน
      </span>
    </div>
  );
}
