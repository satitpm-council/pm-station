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
      className={`${promptFont.variable} font-sans h-full min-h-screen bg-black px-4 py-6 lg:px-6 lg:py-10`}
    >
      <Component {...pageProps} />
    </div>
  );
}
