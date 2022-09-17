import type {
  QueryDocumentSnapshot,
  DocumentSnapshot,
} from "firebase/firestore";

import { mutate } from "swr";
import type { TypeOf, ZodObject, ZodRawShape } from "zod";
import { ZodError } from "zod";
import { captureException } from "@sentry/remix";

export type Result<T extends Record<string, any>> = T & {
  __snapshot: QueryDocumentSnapshot;
};
export const convertFirestoreData = <
  Schema extends ZodObject<Shape>,
  Shape extends ZodRawShape = ZodRawShape,
  T extends TypeOf<Schema> = TypeOf<Schema>
>(
  __snapshot: DocumentSnapshot,
  schema: Schema,
  mutateDoc = true
): Result<T> => {
  try {
    const validated = schema.parse(__snapshot.data());
    const returns = {
      __snapshot,
      ...validated,
    } as Result<T>;
    if (mutateDoc) {
      mutate(__snapshot.ref.path, returns);
    }
    return returns;
  } catch (err) {
    if (err instanceof ZodError) {
      captureException(
        new Error(`Invalid schema for document ${__snapshot.ref.path}.`)
      );
    }
    if (process.env.NODE_ENV === "development") {
      console.error(err);
    }
    throw err;
  }
};
