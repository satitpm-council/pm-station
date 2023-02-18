import Head from "next/head";
import Image from "next/image";

export default function IndexPage() {
  return (
    <main className="flex flex-col items-center justify-center w-full h-full flex-1">
      <Head>
        <title>รับรูป Photobooth : PM Farewell 64&67</title>
        <meta
          property="description"
          content='รับรูปภาพซุ้ม Photobooth งานอำลานักเรียนชั้น ม.3 และ ม.6 ปีการศึกษา 2565 "OMG จบซักที"'
        />
      </Head>
      <div className="mx-4 after:content relative col-span-1 row-span-3 flex flex-col items-center justify-center gap-2 md:gap-4 lg:gap-10 overflow-hidden rounded-lg bg-white/10 px-6 py-8 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight">
        <div className="my-[-70px] mx-[-50px] flex-shrink-0">
          <Image
            src="/logo/FCSHADOW.png"
            alt="FCSHADOW"
            className="object-cover"
            width={300}
            height={300}
          />
        </div>
        <div className="flex flex-col gap-4 mt-[-20px]">
          <h1 className="text-2xl font-bold">รับรูปซุ้ม Photobooth</h1>
          <div className="max-w-[35ch] space-y-4 text-sm text-white/75">
            <p>
              นักเรียนระดับชั้น ม.3 และ ม.6 สามารถสแกน QR Code
              บนบัตรเชิญเพื่อรับรูปได้ที่นี่
            </p>
            <p className="font-medium text-white">
              หากไม่สามารถสแกนคิวอารโค้ดได้ หรือเข้าสู่ระบบแล้วไม่พบรูปภาพ
              กรุณาติดต่อคณะกรรมการนักเรียนทางไอจี @coolkidssatit
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
