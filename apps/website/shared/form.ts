import { useRouter } from "next/navigation";
import { useCallback } from "react";

type UseClientSubmitParams = {
  /** The action of the form to be submitted. */
  action: string;
  /** The query to be sent with the form. Provide an empty array if no search query is required to be sent. */
  query: string[];
};

/**
 * A hook that submits a form client-side.
 * This is useful to trigger Next.js client-side navigation (such as loading state).
 */
export const useClientSubmit = (params: UseClientSubmitParams) => {
  const { replace } = useRouter();
  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const entries = Array.from(
        new FormData(event.currentTarget).entries()
      ).filter(
        ([key, value]) =>
          params.query.includes(key) && typeof value === "string" && value
      ) as [string, string][];
      if (entries.length === 0 && params.query.length > 0) {
        return;
      }
      replace(
        `${params.action}${
          params.query.length > 0
            ? "?" + new URLSearchParams(entries).toString()
            : ""
        }`
      );
    },
    [replace, params]
  );
  return {
    handleSubmit,
  };
};
