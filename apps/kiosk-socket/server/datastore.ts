import { redis } from "@station/server/redis";

type CachedData<V> = {
  value: V | null;
  /** The expiration timestamp in milliseconds. */
  expiration: number;
  /** */
  validator?: (value: any) => V;
};

type CachedDataStore<T> = {
  [K in keyof T & string]: CachedData<T[K]>;
};

type Options<V> = Pick<CachedData<V>, "validator"> & {
  expiration: number;
};

// Check if the given value is a valid JS Date object
const isDate = (value: any): value is Date => {
  return value instanceof Date && !isNaN(value.getTime());
};

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

  private returnData<K extends keyof T & string, V extends T[K]>({
    value,
    validator,
  }: Omit<CachedData<V>, "expiration">): V | null {
    if (value) {
      return validator ? validator(value) : value;
    }
    return null;
  }
  private getFromCache<K extends keyof T & string>(key: K): T[K] | null {
    if (this.data[key]) {
      if (this.data[key].expiration < Date.now()) {
        return this.returnData(this.data[key]);
      }
      this.unsetCacheValue(key);
    }
    throw new Error(`Cached value for '${key}' is not valid or not existed.`);
  }
  /**
   * Reads a value from the cache. If the key is expired or not found in the cache, it will try to get the value from Redis.
   * @param key - The key of the data that will be read.
   * @returns The value of the key, or null if the key is not found or expired.
   */
  async read<K extends keyof T & string>(key: K): Promise<T[K] | null> {
    try {
      return this.getFromCache(key);
    } catch {
      const [ttl, value] = await Promise.all([
        redis.pttl(key),
        redis.get<T[K]>(key),
      ]);
      if (value) {
        const { validator, expiration } = this.data[key] ?? {};
        const validatedValue = this.returnData({ value, validator });
        const data: CachedData<T[K]> = Object.assign({}, this.defaults, {
          value: validatedValue,
          expiration: expiration,
          validator,
        });
        if (ttl > 0 && value) {
          this.setCache(key, data);
          return data.value;
        }
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
   */
  async set<K extends keyof T & string>(
    key: K,
    value: T[K],
    options: Partial<Options<T[K]>>
  ): Promise<void>;
  /**
   * Writes a value to the cache and sets the expiration time.
   * @param key - The key of the data that will be set.
   * @param value - The value of the data that will be set.
   * @param expiration - The Unix timestamp in milliseconds that represents the expiration time of the key.
   * @returns The value of the key, or null if the key is not found or expired.
   */
  async set<K extends keyof T & string>(
    key: K,
    value: T[K],
    expiration: Options<T[K]>["expiration"]
  ): Promise<void>;
  /**
   * Writes a value to the cache and sets the expiration time.
   * @param key - The key of the data that will be set.
   * @param value - The value of the data that will be set.
   * @param optionsOrExpiration - The options or expiration time for the data that will be set.
   */
  async set<K extends keyof T & string>(
    key: K,
    value: T[K],
    optionsOrExpiration: Partial<Options<T[K]>> | Options<T[K]>["expiration"]
  ) {
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
    redis.set(key, JSON.stringify(value));
    redis.expireat(key, expiration);

    // Set the local cache
    this.setCache(key, data);
  }

  private setCache<K extends keyof T & string>(key: K, data: CachedData<T[K]>) {
    this.data[key] = data;
  }

  /**
   * Deletes a value from the local cache, and also on Redis.
   * @param key - The key of the data that will be deleted.
   */
  async delete<K extends keyof T & string>(key: K) {
    await redis.del(key);
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
