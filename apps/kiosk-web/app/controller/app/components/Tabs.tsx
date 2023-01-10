import { BarsArrowDownIcon, MusicalNoteIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
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
  return (
    <div className="bg-[#222222] border-t border-zinc-600 flex divide-x divide-zinc-600">
      {items.map((item) => (
        <Link
          href={item.href}
          key={item.name}
          className="flex flex-col gap-1 items-center text-center w-full px-6 py-3 text-sm"
        >
          {<item.icon className="h-5 w-5 text-gray-300" />}
          <span className="text-gray-400">{item.name}</span>
        </Link>
      ))}
    </div>
  );
}
