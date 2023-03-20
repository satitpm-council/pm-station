import { defineConfig } from "cypress";
import { resolve } from "path";
import { setupTestEnv } from "build-config";
import { setupFirebaseAdminEvents } from "./cypress/node-events/firebase";

require("dotenv").config({ path: resolve(__dirname, "../../.env") });
setupTestEnv("client-web");

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      setupFirebaseAdminEvents(on, config);
    },
  },
  env: {
    FIREBASE_PROJECT_ID: process.env.PM_STATION_FIREBASE_PUBLIC_PROJECT_ID,
    MOCK_PHONE_NUMBER: "0812345678",
  },
});
