import { ClientInitializePlaylist } from "./client";
import { ValidatedDocument } from "@lemasc/swr-firestore";
import { TypeOf } from "zod";
import { PlaylistRecord } from "@station/shared/schema";

export default async function InitializePlaylist({
  initDataPromise,
}: {
  initDataPromise: Promise<ValidatedDocument<TypeOf<typeof PlaylistRecord>>>;
}) {
  const initData = await initDataPromise;

  return <ClientInitializePlaylist initData={initData} />;
}
