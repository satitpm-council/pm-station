import { env } from "@/env.mjs";
import { serverApiRequest } from "@/shared/server-api";

const SpotifyRequest = serverApiRequest({
  prefixUrl: "https://api.spotify.com/v1",
  auth: {
    clientId: env.SPOTIFY_CLIENT_ID,
    clientSecret: env.SPOTIFY_CLIENT_SECRET,
    tokenEndpoint: "https://accounts.spotify.com/api/token",
    cachedKVKey: "spotify-token",
    clientAuthMode: "basic",
  },
});

export default SpotifyRequest;
