import { Server } from "../types";
import { AuthParam, ControllerAuthParam, DeviceConflictError } from "../types";
import { getTodayPlaylist } from "../utils";
import { verifyIdToken } from "./firebase";

type Middleware = Parameters<Server["use"]>["0"];
type MiddlewareParams = Parameters<Middleware>;

const disconnectClients = async (
  io: Server,
  auth: ControllerAuthParam
): Promise<void> => {
  const controllerClients = (await io.fetchSockets()).filter(
    (c) => c.data.type === "controller"
  );

  if (controllerClients.length > 0) {
    // if (auth.forceDisconnect) {
    // Disconnect the clients that are in the force disconnect list
    const clientsToDisconnect = controllerClients.filter((c) =>
      auth.forceDisconnect?.includes(c.id)
    );
    if (clientsToDisconnect.length > 0) {
      clientsToDisconnect.forEach((c) => c.disconnect(true));
      return disconnectClients(io, auth);
    }
  }
  // There're still clients pending to be disconnected.
  // Throws an error with the list of clients to be disconnected.
  const error = new Error(
    "More than 1 controller clients are currently connected. Requires force disconnect."
  ) as DeviceConflictError;
  error.data = { disconnectClients: controllerClients.map((c) => c.id) };

  throw error;
};

export const authMiddleware = async (
  io: Server,
  socket: MiddlewareParams["0"]
): Promise<null> => {
  console.log("Starting auth middleware...");
  const auth = (socket.handshake.auth || {}) as AuthParam;
  socket.data.type = auth.type;
  if (auth.type === "controller") {
    if (!auth.token) throw new Error("Unauthorized.");
    const user = await verifyIdToken(auth.token, true);
    socket.data.user = user;
    //await disconnectClients(io, auth);
  }
  return null;
};
