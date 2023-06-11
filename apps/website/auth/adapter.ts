import { XataAdapter } from "@next-auth/xata-adapter";
import { XataClient } from "@station/db";
import { AdapterUser } from "next-auth/adapters";
import { extendAdapter } from "./internal/adapter";

const client = new XataClient({
  apiKey: process.env.XATA_API_KEY,
  branch: process.env.XATA_BRANCH,
  fetch: (url, init) => {
    return fetch(url, {
      ...(init ?? {}),
      /*next: {
        revalidate: 1000,
      },*/
    });
  },
});

const baseAdapter = XataAdapter(client);

export default baseAdapter;
/*
export default extendAdapter(baseAdapter, {
  getUser: {
    override: async (id) => {
      const user = await client.db.nextauth_users
        .cache(1000)
        .filter({ id })
        .getFirst();
      return (user as AdapterUser) ?? null;
    },
  },
});
*/
