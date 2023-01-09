import { ItemProps } from "@station/client/songrequests";
import { SongRequestSearchRecord } from "@station/shared/schema/types";
import { Reorder } from "framer-motion";
import { SongRequestRecordItem } from "./item";

export const ReorderItem = <T extends SongRequestSearchRecord>({
  track,
  ...props
}: ItemProps<T>) => {
  return (
    <Reorder.Item value={track}>
      <SongRequestRecordItem track={track} {...props} />
    </Reorder.Item>
  );
};
