import axios from "axios";
import {redis} from "../redis"
import {isString, isNumber} from "../guards"

const getCredentials = () => {
  const clientId = process.env.PM_STATION_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.PM_STATION_SPOTIFY_CLIENT_SECRET;
  return Buffer.from(clientId + ":" + clientSecret).toString("base64");
};

type TokenResponse = {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
};

type TokenData = Pick<TokenResponse, "access_token"> & {
    "expires_at": number
}

const TOKEN_KEY = process.env.PM_STATION_SPOTIFY_TOKEN_KEY as string;
const EXPIRES_KEY = process.env.PM_STATION_SPOTIFY_EXPIRES_KEY as string;

let tokenData: TokenData | undefined;

export const getToken = async (): Promise<TokenData> => {
  const { data } = await axios.post<TokenResponse>(
    "/api/token",
    new URLSearchParams({
      grant_type: "client_credentials",
    }),
    {
      baseURL: "https://accounts.spotify.com",
      headers: {
        Authorization: `Basic ${getCredentials()}`,
      },
    }
  );
  tokenData = {
      "access_token": data["access_token"],
      expires_at: new Date().valueOf() + data["expires_in"]
  };
  await redis.set(TOKEN_KEY,data["access_token"]);
  await redis.set(EXPIRES_KEY,data["expires_in"])
  return tokenData;
};


export const getCachedToken = async (): Promise<TokenData> => {
    const access_token = await redis.get(TOKEN_KEY);
    const expires_at = await redis.get(EXPIRES_KEY);
    if(isString(access_token) && isNumber(expires_at)) {
        tokenData = {
            access_token,
            expires_at
        }
        return tokenData
    }
    throw new Error("Invalid token data");
}

export const invalidateToken = async () => {
    tokenData = undefined;
    await redis.del(TOKEN_KEY);
    await redis.del(EXPIRES_KEY)
}

export const 