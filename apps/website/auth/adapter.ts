import { XataAdapter } from "@next-auth/xata-adapter";
import { getDb } from "@station/db";

const baseAdapter = XataAdapter(getDb());

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
