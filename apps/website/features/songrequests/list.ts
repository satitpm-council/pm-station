import { songRequestSchema } from "@/schema/songrequests";
import { parseResultsWithMetadata } from "@/schema/xata";
import { getDb } from "@station/db";

export const listSongRequests = async () => {
  const client = getDb();
  const items = await client.db.songrequests
    .sort("lastSubmittedAt", "desc")
    .sort("title", "asc")
    .getAll();

  const idsFromQuery = items.map((q) => q.id);

  // Summarize to get submissionCount
  const { summaries } = await client.db.songrequests_submissions.summarize({
    filter: {
      "songrequest.id": {
        $any: idsFromQuery,
      },
    },
    columns: ["songrequest.id"],
    summaries: {
      submissionCount: {
        count: "songrequest",
      },
    },
  });

  return parseResultsWithMetadata(items, songRequestSchema, (id) => {
    const submissionCount =
      summaries.find((s) => s.songrequest?.id === id)?.submissionCount ?? 0;
    return {
      submissionCount,
    };
  });
};
