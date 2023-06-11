import { Spinner } from "@/components/client";

/**
 * This loading page will be shown when the user is searching for a song.
 * This is done automatically by React Server Components.
 */
export default function Loading() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center py-6 opacity-75 text-sm">
      <Spinner height="50" width="50" color="white" ariaLabel="loading" />
      <span>กำลังค้นหา...</span>
    </div>
  );
}
