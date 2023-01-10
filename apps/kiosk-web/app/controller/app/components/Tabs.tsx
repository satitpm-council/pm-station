"use client";

import { BarsArrowDownIcon, MusicalNoteIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
type Item = {
  name: string;
  href: string;
  icon: (props: React.ComponentProps<"svg">) => JSX.Element;
};
const items: Item[] = [
  {
    name: "คิว",
    href: "/controller/app/queue",
    icon: BarsArrowDownIcon,
  },
  {
    name: "รายการเพลง",
    href: "/controller/app/requests",
    icon: MusicalNoteIcon,
  },
];

export default function Tabs() {
  const pathname = usePathname();
  return (
    <div className="bg-[#222222] border-t border-zinc-600 flex divide-x divide-zinc-600">
      {items.map((item) => (
        <Link
          href={item.href}
          key={item.name}
          className="flex flex-col gap-1 items-center text-center w-full px-6 py-3 text-sm"
        >
          {
            <item.icon
              className={`h-5 w-5 ${
                pathname === item.href ? "text-zinc-100" : "text-zinc-500"
              }`}
            />
          }
          <span
            className={pathname === item.href ? "text-white" : "text-zinc-500"}
          >
            {item.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
