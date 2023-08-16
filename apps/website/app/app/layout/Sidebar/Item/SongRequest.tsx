import { MusicalNoteIcon } from "@heroicons/react/20/solid";
import { MenuItem } from "@/components/layout/Sidebar";

const MusicIcon = <MusicalNoteIcon className="h-4 w-4" />;

export function SongRequestItem({ showIcon = true }: { showIcon?: boolean }) {
  return (
    <MenuItem icon={showIcon ? MusicIcon : undefined} route="/app/songrequests">
      ส่งคำขอเปิดเพลง
    </MenuItem>
  );
}
