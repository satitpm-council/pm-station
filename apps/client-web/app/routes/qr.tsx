import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const { search } = new URL(request.url);
  return redirect(`/farewell/qr${search}`);
};
