import { checkPlaylistAndRedirect } from "./server";

export default async function PlayerPage() {
  await checkPlaylistAndRedirect();
  return (
    <>
      <h1>Projector</h1>
    </>
  );
}
