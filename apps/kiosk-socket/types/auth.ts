import { ExtendedError } from "socket.io/dist/namespace";

export type ControllerAuthParam = {
  type: "controller";
  /**
   * The Firebase authentication ID token.
   * Client will send this to the server to verify its integrity
   * and save the current user data in memory.
   * */
  token: string;
  /**
   * Acknowledge to force disconnect the socket IDs given and allow the current device only.
   */
  forceDisconnect?: string[];
};

export interface DeviceConflictError extends ExtendedError {
  data: {
    /** The socket IDs that need to be disconnected */
    disconnectClients: string[];
  };
}

type DisplayAuthParam = {
  type: "display";
};

// The actual schema that the middleware will get
export type AuthParam = DisplayAuthParam | ControllerAuthParam;
