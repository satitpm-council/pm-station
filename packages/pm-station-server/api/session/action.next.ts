import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { verifySession, createClientSignInToken } from "@station/server/auth";

export const action: ActionFunction = async ({ request }) => {
  try {
    const user = await verifySession(request);
    if (!user) throw new Error("User not found");
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
    return json({ success: false }, 400);
  }
};
