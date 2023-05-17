import Pusher from "pusher-js";
import { Channels } from "./types";


const pusher = new Pusher<Channels>(process.env.NEXT_PUBLIC_PUSHER_APP_ID, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
});

export default pusher;
