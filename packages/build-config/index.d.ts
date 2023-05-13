/**
 * Get the root directory of the monorepo.
 */
export declare const rootDir: string;
/**
 * Get all available monorepo packages name.
 * @returns {string[]}
 */
export declare const getPackages: () => Promise<string[]>;
/**
 * Get all available monorepo packages paths inside `packages` directory.
 * @returns {string[]}
 */
export declare const getPackagePaths: () => Promise<string[]>;
/**
 * Populate test environment variables.
 * @param {string} appName The app name to load dotenv from.
 */
export declare const setupTestEnv: (appName: string) => Promise<void>;
