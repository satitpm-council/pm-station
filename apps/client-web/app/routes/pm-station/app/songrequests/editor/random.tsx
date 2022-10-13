import { getFirestore } from "firebase/firestore";
import { useEffect, useRef } from "react";
import { useFirebase } from "~/utils/firebase";
import RandomTrackSelector from "~/utils/pm-station/songrequests/random.client";

export default function Random() {
  const { app } = useFirebase();
  const instance = useRef<RandomTrackSelector>();
  useEffect(() => {
    if (!instance.current) {
      instance.current = new RandomTrackSelector(getFirestore(app));
    }
    instance.current.getRandomTracks(4).then(console.log);
  }, [app]);
  return null;
}
