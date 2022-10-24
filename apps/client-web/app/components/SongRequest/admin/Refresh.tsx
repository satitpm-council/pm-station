import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { useInstantSearch } from "react-instantsearch-hooks-web";

export default function RefreshButton() {
  const { refresh } = useInstantSearch();
  return (
    <button
      title="Refresh"
      className="rounded text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2"
      onClick={refresh}
    >
      <ArrowPathIcon className="h-5 w-5 inline mr-1 -mt-0.5" /> Refresh
    </button>
  );
}
