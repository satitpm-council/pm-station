import EditorPageHeader from "~/components/PlaylistEditor/Header";
import { withTitle } from "~/utils/pm-station/client";
import PlaylistEditor from "~/components/PlaylistEditor";
import { usePlaylistData } from "~/utils/pm-station/playlists/data";
import dayjs from "dayjs";
import { useEffect } from "react";
import { playlistEditorStore } from "~/components/PlaylistEditor/store";

export const meta = withTitle("แก้ไขรายการเพลง");

export default function EditPlaylistPage() {
  const { playlist, tracks } = usePlaylistData();

  useEffect(() => {
    if (playlist) {
      playlistEditorStore.setState({
        targetPlaylist: playlist,
      });
    }
    return () =>
      playlistEditorStore.setState({
        targetPlaylist: undefined,
      });
  }, [playlist]);

  useEffect(() => {
    if (!tracks) return;
    playlistEditorStore.setState({
      count: tracks.length,
      addedIds: new Set(tracks.map(({ id }) => id)),
    });
    playlistEditorStore.getState().pushData(tracks);
  }, [tracks]);

  return (
    <>
      <EditorPageHeader title={"แก้ไขรายการเพลง"}>
        {playlist ? `วันที่ ${dayjs(playlist.queuedDate).format("LL")}` : ``}
      </EditorPageHeader>
      {tracks && <PlaylistEditor />}
    </>
  );
}
