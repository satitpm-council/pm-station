/// These implementations made me almost scream.
/// Because Next.js middleware uses the Edge Runtime,
/// it doesn't have access to the Node.js crypto module.

/// ChatGPT doesn't help me either.

function str2ab(str: string) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

const toHex = (value: ArrayBuffer) => {
  // @ts-ignore
  return [...new Uint8Array(value)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
};

/**
 * The same value of running
 *
 * `createHash("sha256").update(value).digest("hex")`
 *
 * but in Web Crypto API.
 */
export const createHash = (_: "sha256") => {
  return {
    update(value: string) {
      return {
        digest: async (_: "hex") => {
          const hash = await crypto.subtle.digest("SHA-256", str2ab(value));
          return toHex(hash);
        },
      };
    },
  };
};

/**
 * The same value of running
 *
 * `randomBytes(length).toString("hex")`
 *
 * but in Web Crypto API.
 */
export const randomBytes = (length: number) => {
  return {
    toString: (_: "hex") => {
      return toHex(crypto.getRandomValues(new Uint8Array(length)));
    },
  };
};
