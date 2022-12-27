import { HeaderLarge } from "@station/client/layout";
import { LoginSteps } from "./steps";

export default function LoginPage() {
  return (
    <div className="bg-gradient-to-b from-[#151515] to-[#121212] text-white h-full min-h-screen flex flex-col text-center gap-6">
      <div className="flex flex-col items-center justify-center gap-6 flex-grow">
        <header className="scale-75 sm:scale-100">
          <HeaderLarge />
        </header>

        <main className="flex flex-col gap-4 text-center items-center justify-center bg-white rounded-lg bg-opacity-10 mx-8 px-6 sm:px-10 py-6 text-sm">
          <h2 className="font-bold text-2xl">เข้าสู่ระบบ</h2>
          <LoginSteps />
        </main>
      </div>
      <footer className="text-sm mx-2 p-6 text-gray-300">
        ดำเนินการโดย คณะกรรมการนักเรียนฝ่ายเทคโนโลยีสารสนเทศ ประจำปีการศึกษา
        2565
      </footer>
    </div>
  );
}
