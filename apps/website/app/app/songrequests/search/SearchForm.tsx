"use client";

import { useParams, useRouter } from "next/navigation";

export default function SearchForm() {
  const params = useParams();
  const { replace } = useRouter();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const q = data.get("q");
    if (q) {
      replace(`/app/songrequests/search/${encodeURIComponent(q.toString())}`);
    }
  };
  return (
    <form
      onSubmit={submit}
      className="flex flex-row flex-wrap gap-4 text-sm"
      autoComplete="off"
    >
      <input
        name="q"
        type="search"
        autoComplete="off"
        className="pm-station-input"
        placeholder="ป้อนชื่อเพลงหรือศิลปิน"
        defaultValue={decodeURIComponent(params.q ?? "")}
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
