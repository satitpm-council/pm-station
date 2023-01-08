"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { AuthParam } from "kiosk-socket/types";
import { useFirebaseUser } from "@station/client/firebase";
import { controllerStore } from "../shared/store";
import { User } from "@station/shared/user";

/**
 * Resolves the current socket endpoint based on the environment.
 *
 * In development, we use the local server running in port 3001;
 *
 * In production, we use the socket server running in the same domain as the app.
 * @returns
 */
const useSocketEndpoint = () => {
  const [endpoint, setEndpoint] = useState<string | null>(null);
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const { protocol, hostname } = new URL(window.location.href);
      setEndpoint(`${protocol}//${hostname}:3001`);
    } else {
      // initialize socket api first
      fetch("/api/socket").then(() => {
        setEndpoint(window.location.origin);
      });
    }
  }, []);
  return endpoint;
};

export default function InitializeSocket({ user }: { user: User }) {
  const fb_user = useFirebaseUser();
  const endpoint = useSocketEndpoint();

  console.log(endpoint);
  useEffect(() => {
    controllerStore.setState({ user });
  }, [user]);

  useEffect(() => {
    if (!endpoint) return;
    (async () => {
      if (!fb_user) return;
      const setupAuthParam: AuthParam = {
        type: "controller",
        token: await fb_user.getIdToken(),
      };
      const socket: Socket = io(endpoint, {
        auth: setupAuthParam,
      });

      controllerStore.setState({ socket });
      socket.on("connect", () => {
        console.log("Connected successfully");
        controllerStore.setState({ isConnected: true });
      });
      socket.on("connect_error", (error) => {
        console.log(error);
        controllerStore.setState({ isConnected: false });
      });
      socket.on("disconnect", (reason) => {
        console.log(reason);
        controllerStore.setState({ isConnected: false });
      });
    })();

    return () => {
      const { socket } = controllerStore.getState();
      socket?.disconnect();
    };
  }, [fb_user, endpoint]);

  return null;
}
