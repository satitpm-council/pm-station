import Pusher from "pusher-js";
import { ControllerSendEvents } from "./controller/server";

const pusher = new Pusher<ControllerSendEvents>(
  process.env.NEXT_PUBLIC_PUSHER_APP_ID,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
  }
);

export default pusher;
