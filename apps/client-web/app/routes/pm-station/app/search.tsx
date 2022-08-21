import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  console.log("Hello from Search");
  return json({});
};

export default function Index() {
  return <h2>Search</h2>;
}
