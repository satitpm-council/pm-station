import { withTitle } from "~/utils/pm-station/client";

export const meta = withTitle("เข้าสู่ระบบ");

export { loader, action } from "@station/server/api/login";
export { default } from "@station/client/login/page";
