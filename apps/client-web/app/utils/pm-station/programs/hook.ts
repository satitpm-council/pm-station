import { useCollection } from "@lemasc/swr-firestore";
import { Program } from "@station/shared/schema";
import { isEditorClaims, UserRole, useUser } from "../client";
import { zodValidator } from "shared/utils";
import { where } from "@lemasc/swr-firestore/constraints";
import type { TypeOf } from "zod";
import { documentId } from "firebase/firestore";

export const usePrograms = () => {
  const { user } = useUser();
  return useCollection<TypeOf<typeof Program>>(
    user && user.role && user.role > UserRole.USER ? "programs" : null,
    {
      constraints: isEditorClaims(user)
        ? [where(documentId(), "==", user?.programId ?? "unknown")]
        : undefined,
    },
    {
      validator: zodValidator(Program),
    }
  );
};
