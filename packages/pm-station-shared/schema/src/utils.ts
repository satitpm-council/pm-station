import type { Timestamp } from "firebase/firestore";
import { DocumentReference } from "firebase/firestore";
import { isObject, isString } from "shared/utils";

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
  if (typeof arg == "string" || typeof arg === "number" || arg instanceof Date)
    return new Date(arg);
};

const isDocRef = (arg: unknown): arg is DocumentReference => {
  return (
    isObject(arg) &&
    isObject(arg.firestore) &&
    isString(arg.type) &&
    arg.type === "document" &&
    isString(arg.path)
  );
};

const docRef = (arg: unknown) => {
  if (isDocRef(arg)) return arg.path;
  if (typeof arg === "string" && arg.split("/").length % 2 === 0) return arg;
};

export { docRef, preprocessDate, isTimestamp };
