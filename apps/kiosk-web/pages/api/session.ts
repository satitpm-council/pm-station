import { action } from "@station/server/api/session";
import { asNextApi } from "@station/server/next";

export default asNextApi(null, action);

export { apiConfig as config } from "@station/server/next";
