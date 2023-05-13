import { headers } from "next/headers";
import { getCSRFToken } from "../csrf";

export function CSRFTokenField() {
  const csrfToken = getCSRFToken(headers());
  return <input type="hidden" name="csrfToken" value={csrfToken} />;
}
