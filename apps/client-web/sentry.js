const fs = require("fs");
const path = require("path");

require("dotenv").config();
require("dotenv").config({ path: "../../.env" });

const sentryClientFile = path.join(process.cwd(), "app", "sentry.client.json");
if (!process.env.SENTRY_DSN && !fs.existsSync(sentryClientFile)) {
  throw new Error("SENTRY_DSN environment varriable not found.");
}
fs.writeFileSync(
  sentryClientFile,
  JSON.stringify({ SENTRY_DSN: process.env.SENTRY_DSN })
);
