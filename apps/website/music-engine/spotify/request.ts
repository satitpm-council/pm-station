import ky, { HTTPError } from "ky";
import { getToken, invalidateToken } from "./auth";

const SpotifyRequest = ky.create({
  prefixUrl: "https://api.spotify.com/v1",
  hooks: {
    beforeRequest: [
      async (request) => {
        request.headers.set(
          "Authorization",
          `Bearer ${(await getToken()).access_token}`
        );
      },
    ],
    beforeRetry: [
      async ({ request, error }) => {
        if (error instanceof HTTPError && error.response.status === 401) {
          await invalidateToken();
        }
        request.headers.set(
          "Authorization",
          `Bearer ${(await getToken()).access_token}`
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

export default SpotifyRequest;
