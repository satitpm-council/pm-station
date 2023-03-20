/// <reference types="cypress" />
import { UserRecord } from "firebase-admin/auth";
import { UserClaims } from "@station/shared/user";

type User = Omit<UserRecord, "customClaims"> & {
  customClaims?: UserClaims;
};
export const setupFirebaseAdminEvents: Cypress.ResolvedConfigOptions["e2e"]["setupNodeEvents"] =
  async (on, config) => {
    const admin = await import("@station/server/firebase-admin").then(
      (c) => c.default
    );
    const auth = await import("firebase-admin/auth").then((c) =>
      c.getAuth(admin)
    );
    on("task", {
      getUser: async (phoneNumber: string) => {
        return auth.getUserByPhoneNumber(
          `+66${phoneNumber.slice(1)}`
        ) as Promise<User>;
      },
    });
  };

declare global {
  namespace Cypress {
    interface Tasks {
      getUser: (phoneNumber: string) => Promise<Partial<User>>;
    }
  }
}
