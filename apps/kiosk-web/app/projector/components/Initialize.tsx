"use client";

import { useEffect, useMemo } from "react";
import { projectorStore, initializeSocket } from "kiosk-web/store/projector";
import dayjs from "dayjs";
import { usePathname, useRouter } from "next/navigation";
import { usePlaylist } from "@station/client/playlists";
import { controllerStore } from "kiosk-web/store/controller";
import { isDocumentValid } from "@lemasc/swr-firestore";
import { useFirebase } from "@station/client/firebase";
import { useSocketEndpoint } from "kiosk-web/shared/useSocketEndpoint";

export default function Initialize() {
  const router = useRouter();
  const pathname = usePathname();

  useFirebase();
  useEffect(() => {
    const interval = setInterval(
      () => projectorStore.setState({ datetime: dayjs() }),
      1000
    );
    return () => clearInterval(interval);
  }, [pathname]);

  const playlistId = controllerStore((state) => state.playlistId);
  const { data } = usePlaylist(playlistId);
  const queuedDate = useMemo(
    () => (data && isDocumentValid(data) ? data.queuedDate : null),
    [data]
  );

  useEffect(() => {
    if (pathname === "/projector/program") {
      return;
    }
    return projectorStore.subscribe(
      (state) => state.datetime,
      (datetime) => {
        if (queuedDate && !datetime.isBefore(queuedDate)) {
          router.replace("/projector/program");
        }
      }
    );
  }, [router, pathname, queuedDate]);

  useEffect(() => {
    if (pathname === "/projector/end") {
      return;
    }
    projectorStore.subscribe(
      (state) => state.status,
      (status) => {
        if (status === "end") {
          router.replace("/projector/end");
        }
      }
    );
  }, [router, pathname]);

  const endpoint = useSocketEndpoint();
  useEffect(() => {
    if (!endpoint) return;
    initializeSocket(endpoint);
    return () => {
      const { socket } = projectorStore.getState();
      socket?.disconnect();
    };
  }, [endpoint]);

  return null;
}
