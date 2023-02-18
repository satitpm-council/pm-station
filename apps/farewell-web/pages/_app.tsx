import type { AppProps } from "next/app";
import { Prompt } from "@next/font/google";

import "../styles/globals.css";

const promptFont = Prompt({
  variable: "--font-prompt",
  weight: ["400", "500", "600"],
  subsets: ["latin", "thai"],
  display: "block",
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`${promptFont.variable} font-sans h-full min-h-screen bg-black px-4 py-6 lg:px-6 lg:py-10 text-white flex flex-col`}
    >
      <Component {...pageProps} />
      <footer className="w-full text-center leading-7 text-sm mt-4 px-4 pt-6 border-t border-gray-700 text-gray-300">
        ดำเนินการโดย คณะกรรมการนักเรียนประจำปีการศึกษา 2565
        <br />
        IG:{" "}
        <a
          href="https://instagram.com/coolkidssatit/"
          target="_blank"
          rel="noreferrer noopener"
          className="text-blue-400 hover:text-blue-500 underline"
        >
          @coolkidssatit
        </a>
      </footer>
    </div>
  );
}
