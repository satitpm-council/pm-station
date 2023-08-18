"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

export function ActionBox({
  header,
  href,
  icon: Icon,
  className,
  children,
}: {
  header: string;
  children: React.ReactNode;
  href: string;
  icon: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> &
      React.RefAttributes<SVGSVGElement>
  >;
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
      href={href}
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
