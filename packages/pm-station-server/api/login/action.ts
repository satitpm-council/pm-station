import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createSession } from "@station/server/auth";
import { getFormData } from "@station/shared/api";
import type { LoginAction } from "@station/shared/api";

export const action: ActionFunction = async ({ request }) => {
  const { continueUrl, token } = await getFormData<LoginAction>(request);
  if (token) {
    try {
      const session = await createSession(request.headers, token);
      return redirect(continueUrl ?? `/pm-station/app`, {
        headers: {
          "Set-Cookie": session,
        },
      });
    } catch (err) {
      console.error(err);
    }
  }
  return redirect("/pm-station");
};
