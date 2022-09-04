import { browserSessionPersistence } from "firebase/auth";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useCallback, useEffect, useState, useRef } from "react";
import type { FormEventHandler } from "react";

import { useFirebase } from "~/utils/firebase";
import { SubmitButton } from "../SubmitButton";
import type { PhoneLoginStepProps } from "./types";
import { captureException } from "@sentry/remix";

export function EnterPhone({ setLoginRequest }: PhoneLoginStepProps) {
  const [loading, setLoading] = useState(false);
  const { auth } = useFirebase("pm-station");
  const recaptchaVerifier = useRef<RecaptchaVerifier>();
  const recaptchaSubmit = useRef<HTMLButtonElement>(null);
  const phoneInput = useRef<HTMLInputElement>(null);

  const submitPhone = useCallback(async () => {
    if (
      !phoneInput.current ||
      !recaptchaVerifier.current ||
      !recaptchaSubmit.current
    )
      return;
    try {
      const phoneNo = "+66" + phoneInput.current.value.slice(1);
      const confirm = await signInWithPhoneNumber(
        auth,
        phoneNo,
        recaptchaVerifier.current
      );
      setLoginRequest({
        phoneNo: phoneInput.current.value,
        ...confirm,
      });
    } catch (err) {
      console.error(err);
      captureException(err);
      setLoginRequest(undefined);
    } finally {
      setLoading(false);
    }
  }, [auth, setLoginRequest]);

  useEffect(() => {
    if (!auth || !recaptchaSubmit.current) return;
    auth.setPersistence(browserSessionPersistence);
    recaptchaVerifier.current = new RecaptchaVerifier(
      recaptchaSubmit.current,
      {
        size: "invisible",
        callback: (t: string) => {
          submitPhone();
        },
      },
      auth
    );
    return () => {
      recaptchaVerifier.current?.clear();
    };
  }, [auth, submitPhone]);

  const submitForm: FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await recaptchaVerifier.current?.verify();
    } catch (err) {
      console.error(err);
      captureException(err);
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col" onSubmit={submitForm}>
      <label htmlFor="phone-input">ป้อนเบอร์โทรศัพท์มือถือ</label>
      <input
        name="phone-input"
        autoComplete="off"
        type="tel"
        required
        className="pm-station-input my-4 text-center"
        pattern="[0-9]{10}"
        ref={phoneInput}
        disabled={loading}
        placeholder="ป้อนตัวเลขเท่านั้น"
      />
      <SubmitButton loading={loading} ref={recaptchaSubmit}>
        ต่อไป
      </SubmitButton>
    </form>
  );
}
