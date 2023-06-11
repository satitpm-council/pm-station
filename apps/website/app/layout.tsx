import "../styles/root.css";
import "../styles/pm-station.css";
import "react-toastify/dist/ReactToastify.min.css";

import { Prompt } from "next/font/google";
import { Metadata } from "next";
import { ToastContainer } from "@/components/client";

const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600"],
  variable: "--font-prompt",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PM Station",
    template: "%s | PM Station",
  },
  description:
    "โครงการ PM Station โดยคณะกรรมการนักเรียนฝ่ายเทคโนโลยีสารสนเทศ ประจำปีการศึกษา 2565 โรงเรียนมัธยมสาธิตวัดพระศรีมหาธาตุ มหาวิทยาลัยราชภัฏพระนคร",
  openGraph: {
    type: "website",
  },
  twitter: {
    card: "summary",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={prompt.variable}>
      <body>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
