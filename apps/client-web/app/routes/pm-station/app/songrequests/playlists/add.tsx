import EditorPageHeader from "~/components/PlaylistEditor/Header";
import { withTitle } from "~/utils/pm-station/client";
import PlaylistEditor from "~/components/PlaylistEditor";

export const meta = withTitle("เพิ่มรายการเพลง");

export default function AddPlaylistPage() {
  return (
    <>
      <EditorPageHeader title={"เพิ่มรายการเพลง"}>
        เลือกเพลงสำหรับเพิ่มลงในรายการ
      </EditorPageHeader>
      <PlaylistEditor />
    </>
  );
}
