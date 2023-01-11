"use client";

import { useEffect, useRef, useState } from "react";
import { AuthParam } from "kiosk-socket/types";
import { useFirebase, useFirebaseUser } from "@station/client/firebase";
import { controllerStore, initializeSocket } from "kiosk-web/store/controller";
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

  console.log(fb_user);
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

  useEffect(() => {
    if (!endpoint) return;
    (async () => {
      if (!fb_user) return;
      const setupAuthParam: AuthParam = {
        type: "controller",
        token: await fb_user.getIdToken(),
      };

      initializeSocket(endpoint, setupAuthParam);
    })();

    return () => {
      const { socket } = controllerStore.getState();
      socket?.disconnect();
    };
  }, [fb_user, endpoint]);

  return null;
}
