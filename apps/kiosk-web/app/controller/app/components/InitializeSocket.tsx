"use client";

import { useEffect, useRef } from "react";
import { useFirebase, useFirebaseUser } from "@station/client/firebase";
import { controllerStore } from "kiosk-web/store/controller";
import { User } from "@station/shared/user";
import { signInWithCustomToken } from "firebase/auth";
import axios from "shared/axios";
import { SessionActionResponse } from "@station/shared/api";
import { useSocketEndpoint } from "kiosk-web/shared/useSocketEndpoint";

export default function InitializeSocket({ user }: { user: User }) {
  const isLoading = useRef(false);
  const { auth } = useFirebase();
  const fb_user = useFirebaseUser();
  const endpoint = useSocketEndpoint();

  useEffect(() => {
    controllerStore.setState({ user });
  }, [user]);

  useEffect(() => {
    if (user && !fb_user && !isLoading.current) {
      // If server user session is existed, but not on the client-side,
      // grab the sign-on token from backend.
      (async () => {
        isLoading.current = true;
        try {
          const {
            data: { token },
          } = await axios.post<SessionActionResponse>("/api/session");
          await signInWithCustomToken(auth, token);
        } catch (err) {
          console.error(err);
        }
        isLoading.current = false;
      })();
    }
  }, [user, fb_user, auth]);

  /**
   * As we send the events to the backend, there's no disconnect event
   * except the user goes offline. We check for the navigator.onLine status.
   */
  useEffect(() => {
    const onlineEventHandler = () => {
      controllerStore.setState({
        isConnected:
          typeof navigator === undefined ? true : navigator.onLine ?? true,
      });
    };
    onlineEventHandler();
    window.addEventListener("online", onlineEventHandler);
    window.addEventListener("offline", onlineEventHandler);

    return () => {
      window.removeEventListener("online", onlineEventHandler);
      window.removeEventListener("offline", onlineEventHandler);
    };
  }, []);

  return null;
}
