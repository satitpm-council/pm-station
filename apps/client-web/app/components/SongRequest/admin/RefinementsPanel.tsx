import { FunnelIcon } from "@heroicons/react/20/solid";
import type { ReactNode } from "react";
import { useState } from "react";
import Modal from "~/components/Modal";

export function RefinementsPanel({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="flex-shrink-0">
        <button
          className="lg:hidden px-3 py-1.5 text-sm pm-station-btn bg-blue-500 hover:bg-blue-600"
          onClick={() => setIsOpen(true)}
        >
          <FunnelIcon className="h-5 w-5 inline -ml-1 -mt-0.5 mr-1" />
          ตั้งค่าตัวกรอง
        </button>
      </div>
      <div className="hidden lg:flex flex-col w-full max-w-[15rem] divide-y divide-gray-400">
        {children}
      </div>
      <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
        <div className="w-full flex items-center justify-center">
          <div className="divide-y md:gap-10 md:divide-y-0 flex md:flex-row flex-col flex-wrap">
            {children}
          </div>
        </div>
      </Modal>
    </>
  );
}
