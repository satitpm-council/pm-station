import { FirebaseOptions } from "@firebase/app";
import { ServiceAccount } from "firebase-admin/app";

export type FirebaseConfig = Required<
  Pick<
    FirebaseOptions,
    | "apiKey"
    | "authDomain"
    | "projectId"
    | "storageBucket"
    | "messagingSenderId"
    | "appId"
    | "measurementId"
  >
>;

export type FirebaseAdminConfig = Required<
  Pick<ServiceAccount, "projectId" | "clientEmail" | "privateKey">
>;

/**
 * **Global app configuration.**
 *
 * This configuration is used instead of environment variables to allow for type checking, build-time validation,
 * and documentation for each options. It will then be generated as a dotenv file for use at runtime.
 *
 */
export type AppConfig = {
  /**
   * Configures the client-side Firebase instance.
   *
   * Firebase is used for authentication and database.
   * In each school year, a new, seperated Firebase project should be created.
   */
  firebase: FirebaseConfig;
  /**
   * Configures the server-side Firebase instance.
   *
   * Firebase Admin SDK is used for verifying users tokens and accessing the database securely from the server.
   */
  firebaseAdmin: FirebaseAdminConfig;
  /**
   * Configures the Algolia search engine for song requests.
   *
   * Algolia is used for advanced searching, sorting, and filtering of song requests.
   */
  algolia: {
    /**
     * The Algolia application ID.
     */
    appId: string;
    /**
     * The Algolia search-only API key.
     */
    apiKey: string;
    /**
     * The Algolia index name. Defaults to `station_songrequests`.
     */
    indexName?: string;
    /**
     * The Algolia indexing API key.
     *
     * Use in conjunction with Firebase functions to index data from Firebase Firestore.
     */
    indexApiKey?: string;
  };
  /**
   * Configures the auth session cookie.
   */
  session: {
    /**
     * The cookie session name. Defaults to `__session`.
     */
    name?: string;
    /**
     * The cookie session secret used to encrypt and decrypt the cookie. Should be at least 32 characters long.
     */
    secret: string;
    /**
     * The cookie session expiration in hours. Defaults to 168 (7 * 24) hours.
     */
    expiration?: number;
  };
};
