import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { captureException } from "@sentry/remix";
import {
  createClientSignInToken,
  verifyCSRFToken,
} from "~/utils/pm-station/auth.server";

export const action: ActionFunction = async ({ request }) => {
  try {
    const user = await verifyCSRFToken(request);
    return json(
      { success: true, token: await createClientSignInToken(user) },
      {
        headers: {
          "Cache-Control": "private,max-age=3500",
        },
      }
    );
  } catch (err) {
    console.error(err);
    captureException(err);
    return json({ success: false }, 400);
  }
};
