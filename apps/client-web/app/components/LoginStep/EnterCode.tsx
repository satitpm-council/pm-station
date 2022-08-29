import type { User } from "firebase/auth";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { useState, useRef } from "react";
import type { FormEventHandler } from "react";

import { useFirebase } from "~/utils/firebase";
import { SubmitButton } from "./SubmitButton";
import type { PhoneLoginStepProps } from "./types";
import { useSearchParams, useSubmit } from "@remix-run/react";

export function EnterCode({
  setLoginRequest,
  loginRequest,
}: PhoneLoginStepProps) {
  const submit = useSubmit();

  const [searchParams] = useSearchParams();
  const serverLogin = async (user: User) => {
    // grab the id token and pass it to the backend
    const token = await user.getIdToken();
    const formData = new FormData();
    formData.set("token", token);
    if (searchParams.has("continueUrl")) {
      formData.set("continueUrl", searchParams.get("continueUrl") as string);
    }
    submit(formData, {
      action: "/pm-station?index",
      method: "post",
    });
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
    } finally {
      setLoading(false);
    }
  };

  if (!loginRequest) return null;
  return (
    <form className="flex flex-col gap-4" onSubmit={submitForm}>
      <label htmlFor="code-input">
        ป้อนรหัส 6 หลักที่ถูกส่งไปยังหมายเลข {loginRequest.phoneNo}
      </label>
      <input
        name="code-input"
        autoComplete="off"
        type="number"
        required
        className="pm-station-input pm-station-btn"
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
