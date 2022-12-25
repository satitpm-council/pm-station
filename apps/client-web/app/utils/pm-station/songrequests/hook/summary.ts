import { useFirebaseUser } from "~/utils/firebase";

import { useDocument } from "@lemasc/swr-firestore";

import { SongRequestSummary } from "@station/shared/schema";
import { zodValidator } from "shared/utils";

export const useSongRequestSummary = () => {
  const user = useFirebaseUser();
  return useDocument(user ? "songrequests/summary" : null, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    revalidateIfStale: false,
    validator: zodValidator(SongRequestSummary),
  });
};
