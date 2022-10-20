import { z } from "zod";

export const HitResult = z.object({
  /** The firestore document ID */
  objectID: z.string(),
  /** The path of this firestore document. */
  path: z.string(),
  lastmodified: z.number(),
});

export const mapObjectIdToId = <T extends z.infer<typeof HitResult>>({
  objectID,
  lastmodified,
  path,
  ...rest
}: T) => {
  return {
    id: objectID,
    ...rest,
  };
};
