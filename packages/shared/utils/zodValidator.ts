import type { TypeOf, ZodTypeAny } from "zod";
import { ZodError } from "zod";
import type { ValidatorFn } from "@lemasc/swr-firestore";
import { captureException } from "@sentry/remix";

export const zodValidator = <
  Schema extends ZodTypeAny,
  T extends TypeOf<Schema> = TypeOf<Schema>
>(
  schema: Schema
): ValidatorFn<T> => {
  return async (data, snapshot) => {
    try {
      return schema.parse(data);
    } catch (err) {
      if (err instanceof ZodError) {
        captureException(
          new Error(`Invalid schema for document ${snapshot.ref.path}.`)
        );
      }
      if (process.env.NODE_ENV === "development") {
        console.error(err);
      }
      throw err;
    }
  };
};
