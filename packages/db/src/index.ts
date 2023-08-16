export * from "./xata";

import { XataRecord } from "@xata.io/client";
import { XataClient } from "./xata";

let instance: XataClient | undefined = undefined;

export type { XataRecord };

export type WithXataMetadata<T extends Record<string, unknown>> = T & {
  metadata: XataRecord<any>["xata"];
};

/**
 * In Xata, fields that are linked can be create or updated by providing the ID of the linked record.
 * This type allows us to specify that a field is linked, and that it should be a string.
 */
export type LinkedFields<
  T extends Record<string, unknown>,
  K extends keyof T
> = Omit<T, K> & {
  [P in K]: string;
};

export const getDb = () => {
  if (instance) return instance;

  instance = new XataClient({
    apiKey: process.env.XATA_API_KEY,
    branch: process.env.XATA_BRANCH,
    // Use the native Next.js fetch API
    fetch: (url, init) => {
      return fetch(url, init);
    },
  });
  return instance;
};
