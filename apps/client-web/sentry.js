const fs = require("fs");
const path = require("path");

require("dotenv").config();
require("dotenv").config({ path: "../../.env" });
if (!process.env.SENTRY_DSN) {
  throw new Error("SENTRY_DSN environment varriable not found.");
}
fs.writeFileSync(
  path.join(process.cwd(), "app", "sentry.client.json"),
  JSON.stringify({ SENTRY_DSN: process.env.SENTRY_DSN })
);
