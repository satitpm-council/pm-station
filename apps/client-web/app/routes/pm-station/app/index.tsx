import { MusicalNoteIcon } from "@heroicons/react/20/solid";
import { Link } from "@remix-run/react";
import React, { useEffect, useRef, useState } from "react";
import { withTitle } from "~/utils/pm-station/client";

export const meta = withTitle("หน้าหลัก");

function ActionBox({
  header,
  to,
  icon: Icon,
  className,
  children,
}: {
  header: string;
  children: React.ReactNode;
  to: string;
  icon: (props: React.ComponentProps<"svg">) => JSX.Element;
  className: string;
}) {
  const element = useRef<HTMLAnchorElement | null>(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const e = element.current;
    if (!e) return;
    const enter = () => {
      setHover(true);
    };
    e.addEventListener("mouseenter", enter);
    const leave = () => {
      setHover(false);
    };
    e.addEventListener("mouseleave", leave);
    return () => {
      e.removeEventListener("mouseenter", enter);
      e.removeEventListener("mouseleave", leave);
    };
  }, []);
  return (
    <Link
      to={to}
      ref={element}
      className={
        "flex flex-row sm:flex-col w-full md:w-[300px] rounded-lg bg-[#141414]"
      }
    >
      <div
        className={`rounded-l-lg sm:rounded-b-none sm:rounded-t-lg transition-colors ${className} ${
          hover ? "bg-opacity-90 " : ""
        }py-8 sm:px-8 px-6
         sm:w-full flex items-center justify-center`}
      >
        <Icon className={"h-8 w-8"} />
      </div>
      <div
        className={`rounded-r-lg sm:rounded-t-none sm:rounded-b-lg flex-grow bg-white bg-opacity-10 transition-colors ${
          hover ? "bg-opacity-20 " : ""
        }w-full px-6 py-5 flex flex-col gap-2`}
      >
        <b className="text-base">{header}</b>
        <span className="text-sm text-gray-300">{children}</span>
      </div>
    </Link>
  );
}
export default function Index() {
  return (
    <>
      <h1 className="text-4xl xl:text-5xl font-bold">PM Station</h1>
      <div className="grid sm:grid-cols-2 md:flex flex-row flex-wrap gap-6 py-4">
        <ActionBox
          header="ส่งคำขอ PM Music Request"
          to="songrequests"
          icon={MusicalNoteIcon}
          className="bg-purple-500"
        >
          ส่งคำขอสำหรับเปิดเพลงในรายการ
        </ActionBox>
      </div>
    </>
  );
}
