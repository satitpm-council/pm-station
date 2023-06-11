import ky from "ky";
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
    beforeError: [
      async (error) => {
        if (error.response?.status === 401) {
          invalidateToken();
        }
        return error;
      },
    ],
  },
  retry: {
    limit: 2,
    methods: ["get"],
    statusCodes: [401],
    backoffLimit: 3000,
  },
});

export default SpotifyRequest;
