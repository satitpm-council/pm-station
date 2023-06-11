import ky from "ky";
import { redis } from "@station/server/redis";
import { isString, isNumber } from "shared/utils";

const getCredentials = () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  return Buffer.from(clientId + ":" + clientSecret).toString("base64");
};

type TokenResponse = {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
};

type TokenData = Pick<TokenResponse, "access_token"> & {
  expires_at: number;
};

const TOKEN_KEY = process.env.SPOTIFY_TOKEN_KEY as string;

const tokenResponseToData = ({
  access_token,
  expires_in,
}: Pick<TokenResponse, "access_token" | "expires_in">): TokenData => {
  return {
    access_token,
    expires_at: new Date().valueOf() + expires_in * 1000,
  };
};

/** Token Data: NEVER USE THIS VAR DIRECTLY */
let tokenData: TokenData | undefined;

const getRemoteToken = async (): Promise<TokenData> => {
  const data = await ky
    .post("api/token", {
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
      prefixUrl: "https://accounts.spotify.com",
      headers: {
        Authorization: `Basic ${getCredentials()}`,
      },
    })
    .json<TokenResponse>();
  await redis.set(TOKEN_KEY, data["access_token"]);
  await redis.expire(TOKEN_KEY, data["expires_in"]);
  return tokenResponseToData(data);
};

const getCachedToken = async (): Promise<TokenData | undefined> => {
  const access_token = await redis.get(TOKEN_KEY);
  const expires_in = await redis.ttl(TOKEN_KEY);
  if (isString(access_token) && isNumber(expires_in)) {
    tokenData = tokenResponseToData({
      access_token,
      expires_in,
    });
    if (await isTokenValid()) return tokenData;
  }
  return undefined;
};

export const invalidateToken = async () => {
  tokenData = undefined;
  await redis.del(TOKEN_KEY);
};

const isTokenValid = async () => {
  if (tokenData) {
    const valid = new Date().valueOf() < tokenData.expires_at;
    if (!valid) await invalidateToken();
    return valid;
  }
  return false;
};

export const getToken = async (): Promise<TokenData> => {
  if (tokenData && (await isTokenValid())) return tokenData;
  try {
    const cachedToken = await getCachedToken();
    if (cachedToken) return cachedToken;
  } catch (err) {
    console.error(err);
  }
  return getRemoteToken();
};
