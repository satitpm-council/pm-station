"use client";

import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { controllerStore } from "kiosk-web/store/controller";
import { useMemo } from "react";

export default function ConnectionStatus() {
  const isConnected = controllerStore((state) => state.isConnected);
  const Icon = useMemo(
    () => (isConnected ? CheckCircleIcon : XCircleIcon),
    [isConnected]
  );
  return (
    <div className="bg-zinc-800 rounded py-3 px-4 font-bold">
      <Icon
        className={`w-6 h-6 inline-block mr-2 ${
          isConnected ? "text-green-500" : "text-red-500"
        }`}
      />
      {isConnected ? "เชื่อมต่อแล้ว" : "ขาดการเชื่อมต่อ"}
    </div>
  );
}
