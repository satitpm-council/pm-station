import { Prompt } from "@next/font/google";
import "../styles/globals.css";
import "../styles/pm-station.css";

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
      <body>{children}</body>
    </html>
  );
}
