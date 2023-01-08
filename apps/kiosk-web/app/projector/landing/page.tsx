import Countdown from "./components/countdown";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="flex flex-1 py-10 px-8 flex-col text-center gap-6 items-center justify-center">
      <div className="flex gap-10 py-4">
        <Image src="/logo.png" width={150} height={150} alt="Logo" />

        <Image src="/coolkidssatit.png" width={150} height={150} alt="Logo" />

        <Image src="/logo_sc.png" width={150} height={150} alt="Logo" />
      </div>
      <h1 className="text-5xl font-bold">โครงการ PM Station</h1>
      <span>
        โดยคณะกรรมการนักเรียนฝ่ายเทคโนโลยีสารสนเทศ ประจำปีการศึกษา 2565
      </span>
      <div className="flex flex-col gap-4 py-4">
        <span className="text-gray-200 py-4 font-medium text-3xl">
          ขณะนี้ยังไม่ถึงเวลาจัดรายการ
        </span>
        <div
          style={{ zoom: 1.5 }}
          className="bg-white bg-opacity-10 rounded-lg shadow-md px-6 py-4"
        >
          <Countdown />
        </div>
      </div>
    </main>
  );
}
