import axios from "axios";
import { getToken } from "./auth";

const SpotifyRequest = axios.create({
  baseURL: "https://api.spotify.com/v1",
});

SpotifyRequest.interceptors.request.use(async (config) => {
  config.headers = {
    ...(config.headers || {}),
    Authorization: `Bearer ${await (await getToken()).access_token}`,
  };
  return config;
});

export default SpotifyRequest;
