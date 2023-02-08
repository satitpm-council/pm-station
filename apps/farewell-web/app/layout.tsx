import { Prompt } from "@next/font/google";

import "../styles/globals.css";

const promptFont = Prompt({
  variable: "--font-prompt",
  weight: ["400", "500", "600"],
  subsets: ["latin", "thai"],
  display: "block",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={promptFont.variable}>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className="flex flex-col h-full min-h-screen">{children}</body>
    </html>
  );
}
