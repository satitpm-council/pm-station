import { RemixBrowser } from "@remix-run/react";

import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import "broadcastchannel-polyfill";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});
