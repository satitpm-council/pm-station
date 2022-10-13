import type { Timestamp } from "firebase/firestore";
import { DocumentReference } from "firebase/firestore";
import { isObject } from "~/utils/guards";

const isTimestamp = (arg: unknown): arg is Timestamp => {
  return (
    isObject(arg) &&
    typeof (arg as Timestamp).nanoseconds === "number" &&
    typeof (arg as Timestamp).seconds === "number" &&
    typeof (arg as Timestamp).toDate === "function"
  );
};

const preprocessDate = (arg: unknown): Date | undefined => {
  if (isTimestamp(arg)) return arg.toDate();
  if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
};

const docRef = (arg: unknown) => {
  if (arg instanceof DocumentReference) return arg.path;
};

export { docRef, preprocessDate, isTimestamp };
