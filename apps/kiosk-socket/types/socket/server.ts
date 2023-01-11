import { ValidatedDocument } from "@lemasc/swr-firestore";
import { DecodedIdToken } from "firebase-admin/auth";
import { AuthParam } from "../auth";
import { PlaylistRecord } from "@station/shared/schema/types";
import { ControllerSendEvents } from "./controller";

export type ClientToServerEvents = ControllerSendEvents;

export type SocketData = Pick<AuthParam, "type"> & {
  user: DecodedIdToken;
  playlist: ValidatedDocument<PlaylistRecord>;
};
