import { asNextApi } from "@station/server/next";
import { loader } from "@station/server/api/logout/loader.next";

export default asNextApi(loader);

export { apiConfig as config } from "@station/server/next";
