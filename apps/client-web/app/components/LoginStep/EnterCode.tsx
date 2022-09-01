import type { User } from "firebase/auth";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { useState, useRef } from "react";
import type { FormEventHandler } from "react";
import { toast } from "react-toastify";

import { isFirebaseError, useFirebase } from "~/utils/firebase";
import { SubmitButton } from "../SubmitButton";
import type { PhoneLoginStepProps } from "./types";
import { useSearchParams, useSubmit } from "@remix-run/react";
import { toFormData } from "~/utils/api";
import type { LoginAction } from "~/utils/pm-station/api-types";

export function EnterCode({
  setLoginRequest,
  loginRequest,
}: PhoneLoginStepProps) {
  const submit = useSubmit();

  const [searchParams] = useSearchParams();
  const serverLogin = async (user: User) => {
    // grab the id token and pass it to the backend
    const token = await user.getIdToken();
    submit(
      toFormData<LoginAction>({
        token,
        continueUrl: searchParams.get("continueUrl"),
      }),
      {
        action: "/pm-station?index",
        method: "post",
      }
    );
  };

  const [loading, setLoading] = useState(false);
  const { auth } = useFirebase("pm-station");
  const codeInput = useRef<HTMLInputElement>(null);
  const submitForm: FormEventHandler = async (e) => {
    e.preventDefault();
    if (!codeInput.current || !loginRequest) return;
    try {
      setLoading(true);
      const credential = PhoneAuthProvider.credential(
        loginRequest.verificationId,
        codeInput.current.value
      );
      const { user } = await signInWithCredential(auth, credential);
      await serverLogin(user);
    } catch (err) {
      console.error(err);
      const error = isFirebaseError(err)
        ? err.code.endsWith("-verification-code")
          ? "รหัส OTP ไม่ถูกต้อง"
          : err.code.replace("auth/", "")
        : (err as Error).message;

      toast(
        <>
          <b>ไม่สามารถเข้าสู่ระบบได้</b>
          {error && <span>{error}</span>}
        </>,
        {
          type: "error",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  if (!loginRequest) return null;
  return (
    <form className="flex flex-col gap-1 sm:gap-0" onSubmit={submitForm}>
      <label htmlFor="code-input">
        ป้อนรหัส 6 หลักที่ถูกส่งไปยังหมายเลข {loginRequest.phoneNo}
      </label>
      <input
        name="code-input"
        autoComplete="off"
        type="text"
        required
        inputMode="numeric"
        className="pm-station-input"
        pattern="[0-9]{6}"
        ref={codeInput}
        disabled={loading}
      />
      <SubmitButton loading={loading}>เข้าสู่ระบบ</SubmitButton>
      <button
        disabled={loading}
        className="underline disabled:cursor-not-allowed"
        onClick={() => setLoginRequest(undefined)}
      >
        ยกเลิก
      </button>
    </form>
  );
}
