import { User } from "./utils/session";

declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}
