import type { ActionFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { createSession } from "@station/server/auth";
import { getFormData } from "@station/shared/api";
import type { LoginAction } from "@station/shared/api";

export const action: ActionFunction = async ({ request }) => {
  const { token } = await getFormData<LoginAction>(request);
  if (token) {
    try {
      const session = await createSession(request.headers, token);
      return json(
        { success: true },
        {
          headers: {
            "Set-Cookie": session,
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
  }
  return json(
    { success: false },
    {
      status: 400,
    }
  );
};
