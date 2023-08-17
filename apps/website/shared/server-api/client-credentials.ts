import ky from "ky";
import { kv } from "@vercel/kv";
import { z } from "zod";

const tokenResponse = z.object({
  access_token: z.string(),
  token_type: z.enum(["Bearer", "bearer"]),
  expires_in: z.number(),
});

type TokenResponse = z.infer<typeof tokenResponse>;

/**
 * The token data stored in the key-value store.
 * Also used to validate the token data.
 */
export const tokenData = z.object({
  access_token: z.string(),
  expires_at: z.number().refine((expires_at) => {
    // 2 minutes before expiry
    return expires_at > new Date().valueOf() + 2 * 60 * 1000;
  }),
});

type TokenData = z.infer<typeof tokenData>;

function expiresInToExpiresAt(expires_in: number) {
  return new Date().valueOf() + expires_in * 1000;
}

export type ClientCredentialsOptions = {
  clientId: string;
  clientSecret: string;
  tokenEndpoint: string;
  cachedKVKey: string;
  clientAuthMode: "basic" | "body";
  audience?: string;
};

export default class ClientCredentialsAuth {
  private _options: ClientCredentialsOptions;
  private _tokenData?: TokenData;

  constructor(options: ClientCredentialsOptions) {
    this._options = options;
  }

  _getBasicCredentials = () => {
    return btoa(`${this._options.clientId}:${this._options.clientSecret}`);
  };

  _setCachedToken = async (token: TokenResponse) => {
    this._tokenData = tokenData.parse({
      access_token: token["access_token"],
      expires_at: expiresInToExpiresAt(token["expires_in"]),
    });
    await kv.set(this._options.cachedKVKey, token["access_token"]);
    await kv.expire(this._options.cachedKVKey, token["expires_in"]);
  };

  /**
   * Gets the token from the remote authorization server.
   */
  getRemoteToken = async () => {
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      ...(this._options.audience && { audience: this._options.audience }),
      ...(this._options.clientAuthMode === "body" && {
        client_id: this._options.clientId,
        client_secret: this._options.clientSecret,
      }),
    });
    const data = await ky
      .post(this._options.tokenEndpoint, {
        body,
        ...(this._options.clientAuthMode === "basic" && {
          headers: {
            Authorization: `Basic ${this._getBasicCredentials()}`,
          },
        }),
      })
      .json();
    console.log(data);
    return tokenResponse.parse(data);
  };

  /**
   * Invalidates the token in the key-value store.
   */
  invalidateToken = async () => {
    this._tokenData = undefined;
    await kv.del(this._options.cachedKVKey);
  };

  /**
   * Gets the cached token from the key-value store.
   */
  getCachedToken = async () => {
    const access_token = await kv.get(this._options.cachedKVKey);
    const expires_in = await kv.ttl(this._options.cachedKVKey);
    return tokenData.parse({
      access_token,
      expires_at: expiresInToExpiresAt(expires_in),
    });
  };

  /**
   * Gets the token from the cache, or the remote server if the cache is invalid.
   */
  getToken = async () => {
    // If we have a token, check if it's valid by parsing the schema against it.
    if (this._tokenData) {
      try {
        return tokenData.parse(this._tokenData);
      } catch (e) {
        console.error(e);
        await this.invalidateToken();
      }
    }
    // If we don't have a token, try to get it from the cache, and validate it.
    else {
      try {
        this._tokenData = await this.getCachedToken();
        return this._tokenData;
      } catch (e) {
        console.error(e);
      }
    }
    // Neither the cache nor the token is valid, so get a new token from the remote server.
    const remoteToken = await this.getRemoteToken();
    // Set the token in the cache.
    await this._setCachedToken(remoteToken);
    return this._tokenData as TokenData;
  };
}
