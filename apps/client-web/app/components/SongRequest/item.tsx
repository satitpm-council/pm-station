import type { SongRequestRecord } from "~/schema/pm-station/songrequests/types";

export type ItemProps = {
  track: SongRequestRecord;
  onItemClick: (track: SongRequestRecord) => void;
  children?: React.ReactNode | React.ReactNode[];
};

export function Item({ track, onItemClick, children }: ItemProps) {
  return (
    <button
      onClick={() => onItemClick?.(track)}
      key={track?.id}
      className="w-full md:w-[unset] songrequest-item"
    >
      <div className="songrequest-wrapper md:w-[250px]">
        {children}
      </div>
    </button>
  );
}
