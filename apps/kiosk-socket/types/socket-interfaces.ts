import { DecodedIdToken } from "firebase-admin/auth";
import { AuthParam } from "./auth";

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
}

export type ServerSocketData = Pick<AuthParam, "type"> & {
  user: DecodedIdToken;
};
