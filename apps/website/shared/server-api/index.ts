import "server-only";

import ky, { HTTPError } from "ky";
import ClientCredentialsAuth, {
  ClientCredentialsOptions,
} from "./client-credentials";

export type AdminAPIInstanceOptions = {
  prefixUrl: string;
  auth: ClientCredentialsOptions;
};

/**
 * **Server Use Only**
 *
 * High-level wrapper around ky to make authenticated requests to an external API.
 */
export const serverApiRequest = (options: AdminAPIInstanceOptions) => {
  const auth = new ClientCredentialsAuth(options.auth);
  return ky.create({
    prefixUrl: options.prefixUrl,
    hooks: {
      beforeRequest: [
        async (request) => {
          request.headers.set(
            "Authorization",
            `Bearer ${(await auth.getToken()).access_token}`
          );
        },
      ],
      beforeRetry: [
        async ({ request, error }) => {
          if (error instanceof HTTPError && error.response.status === 401) {
            await auth.invalidateToken();
          }
          request.headers.set(
            "Authorization",
            `Bearer ${(await auth.getToken()).access_token}`
          );
        },
      ],
    },
    retry: {
      limit: 2,
      methods: ["get", "put", "head", "delete", "options", "trace"],
      statusCodes: [401, 408, 413, 429, 500, 502, 503, 504],
    },
    fetch: (...args) => {
      return fetch(...args);
    },
  });
};
