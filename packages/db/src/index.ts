export * from "./xata";

import { XataRecord } from "@xata.io/client";
import { XataClient } from "./xata";

let instance: XataClient | undefined = undefined;

export type WithXataMetadata<T extends Record<string, unknown>> = T & {
  metadata: XataRecord<any>["xata"];
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
