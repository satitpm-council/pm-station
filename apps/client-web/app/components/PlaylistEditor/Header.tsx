import { memo, useCallback } from "react";
import { useNavigate } from "@remix-run/react";
import { playlistEditorStore } from "~/components/PlaylistEditor/store";
import type { PageHeaderInnerProps } from "../Header";
import { PageHeader } from "../Header";
import { ArrowRightIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { usePlaylistParam } from "~/utils/pm-station/playlists/param";

const EditorPageHeader = (props: PageHeaderInnerProps) => {
  const playlistId = usePlaylistParam();
  const navigate = useNavigate();
  const deleteDraft = useCallback(() => {
    if (confirm("ต้องการละทิ้งการเปลี่ยนแปลงหรือไม่")) {
      playlistEditorStore.getState().reset();
      navigate(
        `/pm-station/app/songrequests/playlists${
          playlistId ? `/${playlistId}` : ""
        }`,
        {
          replace: true,
        }
      );
    }
  }, [navigate, playlistId]);
  const disableContinue = playlistEditorStore(
    (state) => state.count > 0 && state.count !== state.data.length
  );

  const next = useCallback(() => {
    playlistEditorStore.setState({ showModal: true });
  }, []);

  return (
    <PageHeader
      button={[
        {
          className: "bg-red-500 hover:bg-red-600",
          onClick: deleteDraft,
          text: "ยกเลิก",
          icon: XMarkIcon,
        },
        {
          className:
            "bg-green-500 hover:bg-green-600 disabled:bg-green-200 disabled:text-gray-500",
          onClick: next,
          text: "ต่อไป",
          disabled: disableContinue,
          icon: ArrowRightIcon,
        },
      ]}
      {...props}
    />
  );
};

export default memo(EditorPageHeader);
