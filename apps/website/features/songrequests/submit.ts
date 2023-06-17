import { TrackResponse } from "@station/shared/schema/types";
import { getXataClient, Songrequests } from "@station/db";
import { cookies } from "next/headers";
import { getUser } from "@/auth/server-token";

type XataClient = ReturnType<typeof getXataClient>;
type SubmissionCreateRecord = Parameters<
  XataClient["db"]["songrequests_submissions"]["create"]
>["0"][number];

export async function submitSongRequest(track: TrackResponse) {
  const user = await getUser(cookies());
  if (!user) {
    throw new Error("User not found");
  }
  const client = getXataClient();
  const record = track satisfies Songrequests;
  const submissionRecord = {
    user: user.sub as string,
    songrequest: track.id,
  } satisfies SubmissionCreateRecord;
  await client.transactions.run([
    {
      insert: {
        table: "songrequests",
        record,
      },
    },
    {
      insert: {
        table: "songrequests_submissions",
        record: submissionRecord,
      },
    },
  ]);
}
