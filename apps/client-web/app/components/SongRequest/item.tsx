import type { SongRequestSearchRecord } from "~/schema/pm-station/songrequests/types";

export type ItemProps<T extends SongRequestSearchRecord> = {
  track: T;
  onItemClick: (track: T) => void;
  children?: React.ReactNode | React.ReactNode[];
};

export function Item<T extends SongRequestSearchRecord>({
  track,
  onItemClick,
  children,
}: ItemProps<T>) {
  return (
    <button
      onClick={() => onItemClick?.(track)}
      key={track?.id}
      className="w-full md:w-[unset] songrequest-item"
    >
      <div className="songrequest-wrapper md:w-[250px]">{children}</div>
    </button>
  );
}
