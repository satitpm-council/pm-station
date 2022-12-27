import type { SWRInfiniteKeyLoader } from "swr/infinite/dist/infinite";
import { unstable_serialize as serialize } from "swr";
import { getKey } from "./key";
import { useCallback } from "react";
import { useSWRConfig } from "swr";
import type { ListParams } from "../../sort";
import { useFirebaseUser } from "@station/client/firebase";

const INFINITE_PREFIX = "$inf$";

const getFirstPageKey = (getKey: SWRInfiniteKeyLoader) => {
  return serialize(getKey ? getKey(0, null) : null);
};

/**
 * Mutates the `useSongRequest` infinte hook to refresh data.
 *
 * SWRInfinite cannot be mutate like usual. We copy some implementation from the original source code
 * and adapt it so that we can mutate everywhere.
 */
export const useSongRequestMutate = (context: ListParams) => {
  const user = useFirebaseUser();
  const { mutate, cache } = useSWRConfig();

  const mutateFn = useCallback(() => {
    // The serialized key of the first page.
    const firstPageKey = getFirstPageKey(getKey({ user, context }));
    if (!firstPageKey) return null;

    console.log("Mutate", user, context, firstPageKey);
    // We use cache to pass extra info (context) to fetcher so it can be globally
    // shared. The key of the context data is based on the first page key.
    let contextCacheKey: string | null = "$ctx$" + firstPageKey;

    // Calling `mutate()`, we revalidate all pages
    cache.set(contextCacheKey, [true]);

    return mutate(firstPageKey ? INFINITE_PREFIX + firstPageKey : null);
  }, [cache, context, mutate, user]);
  return mutateFn;
};
