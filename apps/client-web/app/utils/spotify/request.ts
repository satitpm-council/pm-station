import type { AxiosAdapter, AxiosResponse } from "axios";
import axios from "axios";
import { getToken } from "./auth";
import dayjs from "dayjs";
import FileSystemCache from "./cache";
const SpotifyRequest = axios.create({
  baseURL: "https://api.spotify.com/v1",
});

type SpotifyCachedResponse = {
  expires: number;
  response: Pick<AxiosResponse, "data" | "status" | "headers">;
};

if (process.env.NODE_ENV === "development") {
  const SpotifyCachedResponse = new FileSystemCache<SpotifyCachedResponse>(
    "spotify-api"
  );
  SpotifyRequest.defaults.adapter = async (config) => {
    const url = decodeURIComponent(
      config.url + "_" + new URLSearchParams(config.params).toString()
    );
    const cached = await SpotifyCachedResponse.get(url);
    console.log(cached?.expires, new Date().valueOf());
    if (cached?.expires) {
      if (new Date().valueOf() <= cached.expires) {
        console.log("Used cached response for", url);
        return cached.response as AxiosResponse;
      } else {
        SpotifyCachedResponse.delete(url);
      }
    }

    const response = await (axios.defaults.adapter as AxiosAdapter)(config);
    const { data, status, headers } = response;
    await SpotifyCachedResponse.set(url, {
      expires: dayjs().add(15, "minutes").valueOf(),
      response: { data, status, headers },
    });
    return response;
  };
}

SpotifyRequest.interceptors.request.use(async (config) => {
  config.headers = {
    ...(config.headers || {}),
    Authorization: `Bearer ${await (await getToken()).access_token}`,
  };
  return config;
});

export default SpotifyRequest;
