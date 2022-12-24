import { Prompt } from "@next/font/google";
import "../styles/globals.css";

const promptFont = Prompt({
  variable: "--font-prompt",
  weight: ["400", "500", "600"],
  subsets: ["latin", "thai"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={promptFont.variable}>
      <body
        className={`flex h-full min-h-screen bg-gradient-to-b from-zinc-800 to-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
