import ky from "ky";
import { getToken } from "./auth";

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
  },
});

export default SpotifyRequest;
