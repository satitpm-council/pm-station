import { asNextApi } from "@station/server/next";
import { action } from "@station/server/api/login";

export default asNextApi(null, action);

export { apiConfig as config } from "@station/server/next";
