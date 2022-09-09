import { useLocation, useMatches } from "@remix-run/react";
import * as Sentry from "@sentry/remix";
import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";
import { useEffect } from "react";
import SentryConfig from "./sentry.client.json";

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

hydrateRoot(document, <RemixBrowser />);
