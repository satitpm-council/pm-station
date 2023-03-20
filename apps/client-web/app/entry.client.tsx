import { useLocation, useMatches } from "@remix-run/react";
import * as Sentry from "@sentry/remix";
import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";
import { useEffect } from "react";
import LogRocket from "logrocket";
import SentryConfig from "./sentry.client.json";
import "broadcastchannel-polyfill";

Sentry.init({
  dsn:
    process.env.NODE_ENV === "production" ? SentryConfig.SENTRY_DSN : undefined,
  tracesSampleRate: 1,
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.remixRouterInstrumentation(
        useEffect,
        useLocation,
        useMatches
      ),
    }),
  ],
});

if (SentryConfig.LOGROCKET_ID && process.env.NODE_ENV === "production") {
  LogRocket.init(SentryConfig.LOGROCKET_ID);
}

hydrateRoot(document, <RemixBrowser />);
