"use client";

import { useClientSubmit } from "@/shared/form";
import { useSearchParams } from "next/navigation";

export default function SearchForm() {
  const params = useSearchParams();
  const { handleSubmit } = useClientSubmit({
    action: "/app/songrequests/search",
    query: ["q"],
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-row flex-wrap gap-4 text-sm"
      autoComplete="off"
    >
      <input
        name="q"
        type="search"
        autoComplete="off"
        className="pm-station-input"
        placeholder="ป้อนชื่อเพลงหรือศิลปิน"
        defaultValue={decodeURIComponent(params.get("q") ?? "")}
      />
      <button
        type="submit"
        className="bg-[#1fdf64] hover:bg-[#27cf65] focus:ring-[#27cf65] text-white pm-station-btn pm-station-focus-ring"
      >
        ค้นหา
      </button>
    </form>
  );
}
