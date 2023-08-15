import { WithXataMetadata } from "@station/db";
import { XataRecord } from "@xata.io/client";
import { z, ZodObject, ZodRawShape } from "zod";

/**
 * Parse and validate a Xata records against a Zod schema.
 * @param record Xata record to validate
 * @param schema Zod schema to validate against
 * @returns The serializable object with metadata
 */
export const parseWithMetadata = <
  T extends ZodRawShape,
  O extends ZodObject<T>
>(
  record: XataRecord,
  schema: O
): WithXataMetadata<z.infer<O>> => {
  try {
    const parsed = schema.parse(record.toSerializable());
    return {
      ...parsed,
      metadata: record.xata,
    };
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error(err);
    }
    throw err;
  }
};

/**
 * Parse and validate an array of Xata records against a Zod schema.
 * @param record Xata record to validate
 * @param schema Zod schema to validate against
 * @returns The array of records with metadata
 */
export const parseResultsWithMetadata = <
  T extends ZodRawShape,
  O extends ZodObject<T>
>(
  results: XataRecord[],
  schema: O
): WithXataMetadata<z.infer<O>>[] => {
  return results
    .map((record) => {
      try {
        return parseWithMetadata(record, schema);
      } catch {
        return undefined;
      }
    })
    .filter(
      (record): record is WithXataMetadata<z.infer<O>> => record !== undefined
    );
};
