type ControllerAuthParam = {
  type: "controller";
  /**
   * The Firebase authentication ID token.
   * Client will send this to the server to verify its integrity
   * and save the current user data in memory.
   * */
  token: string;
  /**
   * Ackknowledge to force disconnect all socket clients and allow the current device only.
   */
  forceDisconnect?: boolean;
};

type DisplayAuthParam = {
  type: "display";
};

// The actual schema that the middleware will get
export type AuthParam = DisplayAuthParam | ControllerAuthParam;
