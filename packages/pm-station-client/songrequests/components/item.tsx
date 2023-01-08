import type { SongRequestSearchRecord } from "@station/shared/schema/types";
import { classNames } from "../../utils";

export type ItemProps<T extends SongRequestSearchRecord> = {
  track: T;
  onItemClick: (track: T) => void;
  children?: React.ReactNode | React.ReactNode[];
  responsive?: boolean;
};

export function Item<T extends SongRequestSearchRecord>({
  track,
  onItemClick,
  children,
  responsive = true,
}: ItemProps<T>) {
  return (
    <button
      onClick={() => onItemClick?.(track)}
      key={track?.id}
      className={classNames(
        `w-full songrequest-item`,
        responsive && "md:w-[unset]"
      )}
    >
      <div
        className={classNames(
          "songrequest-wrapper",
          responsive && "md:w-[240px]"
        )}
      >
        {children}
      </div>
    </button>
  );
}
