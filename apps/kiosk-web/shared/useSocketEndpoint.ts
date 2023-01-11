"use client";

import { useEffect, useState } from "react";

/**
 * Resolves the current socket endpoint based on the environment.
 *
 * In development, we use the local server running in port 3001;
 *
 * In production, we use the socket server running in the same domain as the app.
 *
 */
export const useSocketEndpoint = () => {
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
