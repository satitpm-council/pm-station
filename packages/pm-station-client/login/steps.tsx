"use client";
import { useState } from "react";
import { EnterCode, EnterPhone } from "./components/LoginStep";
import type { LoginRequest } from "./components/LoginStep";

export const LoginSteps = () => {
  const [loginRequest, setLoginRequest] = useState<LoginRequest>();
  return (
    <>
      {loginRequest ? (
        <EnterCode
          loginRequest={loginRequest}
          setLoginRequest={setLoginRequest}
        />
      ) : (
        <EnterPhone setLoginRequest={setLoginRequest} />
      )}
    </>
  );
};
