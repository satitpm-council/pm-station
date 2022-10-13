import { useFirebaseUser } from "~/utils/firebase";

import { useDocument } from "@lemasc/swr-firestore";

import { SongRequestSummary } from "~/schema/pm-station/songrequests/schema";
import { zodValidator } from "../../zodValidator";

export const useSongRequestSummary = () => {
  const user = useFirebaseUser();
  return useDocument(user ? "/songrequests/summary" : null, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    revalidateIfStale: false,
    validator: zodValidator(SongRequestSummary),
  });
};
