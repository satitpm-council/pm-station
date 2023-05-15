"use client";

import { AudioPlayerProvider } from "react-use-audio-player";

export default function PlayerContext({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  return (
    <AudioPlayerProvider>
      <>{children}</>
    </AudioPlayerProvider>
  );
}
