import { redis } from "@station/server/redis";

type CachedData<V> = {
  value: V | null;
  /** The expiration timestamp in milliseconds. */
  expiration: number;
  /** */
  validator?: (value: any) => V;
};

type CachedResult<V> = Pick<CachedData<V>, "expiration"> & {
  value: NonNullable<CachedData<V>["value"]>;
};

type CachedDataStore<T> = {
  [K in keyof T & string]: CachedData<T[K]>;
};

export type Options<V> = Pick<CachedData<V>, "validator" | "expiration">;

/** Shorthand function for prefixing keys stored in Redis */
const __ = (key: string) => "PMStation_Kiosk_" + key;

/**
 * The DataStore class provides a layer of datestore with expiration time check,
 * and also persist to Redis.
 * @template T - The type of the data that will be stored in the cache.
 */
export default class DataStore<T extends Record<string, unknown>> {
  private data: CachedDataStore<T>;
  private defaults: Options<T[keyof T]>;

  /**
   * Creates a new instance of the DataStore class.
   * @param defaults - The default options for the data store.
   * @param defaults.expiration - The default expiration time of keys in the cache.
   * @param defaults.validator - The default validator function for the data.
   */
  constructor(defaults: Options<T[keyof T]>) {
    this.data = {} as CachedDataStore<T>;
    this.defaults = defaults;
  }

  private returnData<K extends keyof T & string>({
    value,
    validator,
    expiration,
  }: CachedData<T[K]>): CachedResult<T[K]> | null {
    if (value) {
      return {
        value: validator ? validator(value) : value,
        expiration,
      } as CachedResult<T[K]>;
    }
    return null;
  }
  private getFromCache<K extends keyof T & string>(
    key: K
  ): CachedResult<T[K]> | null {
    console.log("getCache", this.data);
    if (this.data[key]) {
      if (this.data[key].expiration > Date.now()) {
        return this.returnData(this.data[key]);
      }
      this.unsetCacheValue(key);
    }
    throw new Error(`Cached value for '${key}' is not valid or not existed.`);
  }
  /**
   * Get a value from the cache. If the key is expired or not found in the cache, it will try to get the value from Redis.
   * @param key - The key of the data that will be read.
   * @returns The value of the key, or null if the key is not found or expired.
   */
  async get<K extends keyof T & string>(
    key: K
  ): Promise<CachedResult<T[K]> | null> {
    console.log("get", key);
    try {
      return this.getFromCache(key);
    } catch (err) {
      console.error(err);
      try {
        const [ttl, value] = await Promise.all([
          redis.pttl(__(key)),
          redis.get<T[K]>(__(key)),
        ]);
        console.log(ttl, value);
        if (ttl > 0 && value) {
          const { validator, expiration } = this.data[key] ?? {};
          const validatedValue = this.returnData({
            value,
            validator,
            expiration,
          }) as CachedResult<T[K]>;
          const data: CachedData<T[K]> = Object.assign(
            {},
            this.defaults as CachedData<T[K]>,
            validatedValue
          );
          this.setCache(key, data);
          return {
            expiration,
            value: validatedValue.value,
          };
        }
      } catch (err) {
        console.error(err);
      }
      return null;
    }
  }
  /**
   * Writes a value to the cache and sets the expiration time.
   * @param key - The key of the data that will be set.
   * @param value - The value of the data that will be set.
   * @param options - The options for the data that will be set.
   * @returns The value of the key, or null if the key is not found or expired.
   * @throws If the value is already expired by the given expiration time.
   */
  async set<K extends keyof T & string>(
    key: K,
    value: T[K],
    options?: Partial<Options<T[K]>>
  ): Promise<void>;
  /**
   * Writes a value to the cache and sets the expiration time.
   * @param key - The key of the data that will be set.
   * @param value - The value of the data that will be set.
   * @param expiration - The Unix timestamp in milliseconds that represents the expiration time of the key.
   * @throws If the value is already expired by the given expiration time.
   */
  async set<K extends keyof T & string>(
    key: K,
    value: T[K],
    expiration?: Options<T[K]>["expiration"]
  ): Promise<void>;
  /**
   * Writes a value to the cache and sets the expiration time.
   * @param key - The key of the data that will be set.
   * @param value - The value of the data that will be set.
   * @param optionsOrExpiration - The options or expiration time for the data that will be set.
   * @throws If the value is already expired by the given expiration time.
   */
  async set<K extends keyof T & string>(
    key: K,
    value: T[K],
    optionsOrExpiration?: Partial<Options<T[K]>> | Options<T[K]>["expiration"]
  ) {
    console.log("set", key, value, optionsOrExpiration);
    const options: Options<T[K]> = Object.assign(
      {},
      this.defaults,
      typeof optionsOrExpiration === "number"
        ? { expiration: optionsOrExpiration }
        : optionsOrExpiration
    );

    const data: CachedData<T[K]> = {
      value,
      expiration: options.expiration,
      validator: options.validator,
    };

    const { expiration } = data;

    // If the key is expired, we shouldn't set to the datastore.
    // Instead, delete it and return null.
    if (expiration && expiration < Date.now()) {
      this.delete(key);
      throw new Error(`Key '${key}', already expired.`);
    }

    // Set the remote redis cache
    await redis.set(__(key), JSON.stringify(value));
    await redis.pexpireat(__(key), expiration);

    // Set the local cache
    this.setCache(key, data);
  }

  private setCache<K extends keyof T & string>(key: K, data: CachedData<T[K]>) {
    this.data[key] = data;
    console.log("setCache", this.data);
  }

  /**
   * Deletes a value from the local cache, and also on Redis.
   * @param key - The key of the data that will be deleted.
   */
  async delete<K extends keyof T & string>(key: K) {
    await redis.del(__(key));
    delete this.data[key];
  }

  private unsetCacheValue<K extends keyof T & string>(key: K) {
    if (this.data[key]) {
      this.data[key] = {
        ...this.data[key],
        value: null,
      };
    }
  }
}
