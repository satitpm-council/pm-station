import { Prompt } from "@next/font/google";
import "react-toastify/dist/ReactToastify.min.css";
import "../styles/globals.css";
import "../styles/pm-station.css";

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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  );
}
