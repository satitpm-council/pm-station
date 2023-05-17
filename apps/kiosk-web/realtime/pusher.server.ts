import Pusher from "pusher";
import { Channels } from "./types";

if (
  typeof process.env.PUSHER_APP_SECRET !== "string" ||
  typeof process.env.NEXT_PUBLIC_PUSHER_APP_ID !== "string" ||
  typeof process.env.NEXT_PUBLIC_PUSHER_APP_KEY !== "string" ||
  typeof process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER !== "string"
) {
  throw new Error("Pusher App enviromnent variable is not set");
}

const pusher = new Pusher<Channels>({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
  useTLS: true,
});

export default pusher;
