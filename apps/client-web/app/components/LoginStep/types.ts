import type { ConfirmationResult } from "firebase/auth";

export type LoginRequest = ConfirmationResult & {
  phoneNo: string;
};

export type PhoneLoginStepProps = {
  setLoginRequest: (loginRequest?: LoginRequest) => void;
  loginRequest?: LoginRequest;
};
