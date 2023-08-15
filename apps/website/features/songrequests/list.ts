import { songRequestSchema } from "@/schema/songrequests";
import { parseResultsWithMetadata } from "@/schema/xata";
import { getDb } from "@station/db";

export const listSongRequests = async () => {
  const client = getDb();
  const items = await client.db.songrequests.getPaginated({
    pagination: {
      size: 5,
    },
  });

  return parseResultsWithMetadata(items.records, songRequestSchema);
};
