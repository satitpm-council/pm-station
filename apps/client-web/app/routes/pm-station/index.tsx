import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useState } from "react";
import { HeaderLarge } from "~/components/Header";
import type { LoginRequest } from "~/components/LoginStep";
import { EnterCode, EnterPhone } from "~/components/LoginStep";

import { withTitle } from "~/utils/pm-station/client";
import { createSession, verifySession } from "~/utils/pm-station/auth.server";
import type { LoginAction } from "~/utils/pm-station/api-types";
import { getFormData } from "~/utils/api";

export const meta = withTitle("เข้าสู่ระบบ");

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

export const loader: LoaderFunction = async ({ request: { headers } }) => {
  if (await verifySession(headers)) return redirect("/pm-station/app");
  return json({});
};

export default function LoginPage() {
  const [loginRequest, setLoginRequest] = useState<LoginRequest>();

  return (
    <div className="bg-gradient-to-b from-[#151515] to-[#121212] text-white h-full min-h-screen flex flex-col text-center gap-6">
      <div className="flex flex-col items-center justify-center gap-6 flex-grow">
        <header className="scale-75 sm:scale-100">
          <HeaderLarge />
        </header>

        <main className="flex flex-col gap-4 text-center items-center justify-center bg-white rounded-lg bg-opacity-10 mx-6 px-6 sm:px-10 py-6 text-sm">
          <h2 className="font-bold text-2xl">เข้าสู่ระบบ</h2>
          {loginRequest ? (
            <EnterCode
              loginRequest={loginRequest}
              setLoginRequest={setLoginRequest}
            />
          ) : (
            <EnterPhone setLoginRequest={setLoginRequest} />
          )}
        </main>
      </div>
      <footer className="text-sm p-6 text-gray-300">
        ดำเนินการโดย คณะกรรมการนักเรียนฝ่ายเทคโนโลยีสารสนเทศ ประจำปีการศึกษา
        2565
      </footer>
    </div>
  );
}
