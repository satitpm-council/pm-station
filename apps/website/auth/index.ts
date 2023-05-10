import { AuthOptions } from "next-auth";

import { pages } from "./pages";
import { providers } from "./providers";

const options: AuthOptions = {
  providers,
  callbacks: {},
  pages,
};
export default options;
