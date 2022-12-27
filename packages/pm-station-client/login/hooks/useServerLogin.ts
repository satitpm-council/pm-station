import { useSearchParams, useSubmit } from "@remix-run/react";

import type { User } from "firebase/auth";
import { toFormData } from "@station/shared/api";
import type { LoginAction } from "@station/shared/api";

export const useServerLogin = () => {
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

  return serverLogin;
};
