import type { LoaderFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import algoliasearch from "algoliasearch/lite";
import { useRef } from "react";
import { InstantSearch } from "react-instantsearch-hooks-web";
import { verifySession } from "~/utils/pm-station/auth.server";
import { UserRole } from "~/utils/pm-station/client";

type AlgoliaEnv = {
  appId: string;
  apiKey: string;
};

type JsonReturn = {
  algolia: AlgoliaEnv;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await verifySession(request);
  if (user?.role && user?.role >= UserRole.EDITOR && user?.type) {
    if (
      !process.env.PM_STATION_ALGOLIA_APP_ID ||
      !process.env.PM_STATION_ALGOLIA_API_KEY
    ) {
      return json({ error: "Cannot initialize Algolia, env not found." }, 500);
    }
    return json<JsonReturn>({
      algolia: {
        appId: process.env.PM_STATION_ALGOLIA_APP_ID,
        apiKey: process.env.PM_STATION_ALGOLIA_API_KEY,
      },
    });
  }
  return redirect("/pm-station/app/songrequests");
};

export default function Editor() {
  const {
    algolia: { apiKey, appId },
  } = useLoaderData<JsonReturn>();
  const searchClient = useRef(algoliasearch(appId, apiKey));
  return (
    <InstantSearch
      searchClient={searchClient.current}
      indexName="station_songrequests"
    >
      <Outlet />
    </InstantSearch>
  );
}
