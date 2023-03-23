/// <reference types="cypress" />
import { UserRecord } from "firebase-admin/auth";
import { UserClaims } from "@station/shared/user";

import { TypeOf } from "zod";
import { zodValidator } from "shared/utils";
import {
  SongRequestRecord,
  SongRequestSubmission,
} from "@station/shared/schema";
import { validateAndParseDate, isDocumentValid } from "@lemasc/swr-firestore";

import type { ValidatedDocument, ValidatorFn } from "@lemasc/swr-firestore";

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
    const db = await import("firebase-admin/firestore").then((c) =>
      c.getFirestore(admin)
    );

    const getDoc = async <T extends Record<string, unknown>>(
      path: string,
      validator: ValidatorFn<T>
    ) => {
      const firebaseDoc = await db.doc(path).get();
      if (!firebaseDoc.exists) {
        throw new Error(`Document at path ${path} is not exists.`);
      }
      try {
        const docData = await validator(firebaseDoc.data(), firebaseDoc as any);
        return {
          id: firebaseDoc.id,
          exists: true,
          hasPendingWrites: false,
          ...docData,
        };
      } catch (err) {
        console.error(err);
        throw err;
      }
    };

    on("task", {
      getUser: async (phoneNumber) => {
        return auth.getUserByPhoneNumber(
          `+66${phoneNumber.replace(/^0/, "")}`
        ) as Promise<User>;
      },
      getSongRequestRecord: async (trackId) => {
        return getDoc(
          "songrequests/" + trackId,
          zodValidator(SongRequestRecord)
        );
      },
      getSongRequestSubmission: async ({ trackId, userId }) => {
        return getDoc(
          `songrequests/${trackId}/submission/${userId}`,
          zodValidator(SongRequestSubmission)
        );
      },
    });
  };

declare global {
  namespace Cypress {
    interface Tasks {
      getUser: (phoneNumber: string) => Promise<Partial<User>>;
      getSongRequestRecord: (
        trackId: string
      ) => Promise<ValidatedDocument<TypeOf<typeof SongRequestRecord>>>;
      getSongRequestSubmission: (props: {
        trackId: string;
        userId: string;
      }) => Promise<ValidatedDocument<TypeOf<typeof SongRequestSubmission>>>;
    }
  }
}
