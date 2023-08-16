"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col gap-4">
      <span>
        เกิดข้อผิดพลาดในการค้นหารายการเพลง กรุณาโหลดหน้าเว็บใหม่อีกครั้ง
      </span>
    </div>
  );
}
