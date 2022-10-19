import { useParams } from "@remix-run/react";

export const usePlaylistParam = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  return playlistId;
};
