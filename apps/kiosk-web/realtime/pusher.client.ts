import Pusher from "pusher-js";

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_ID, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
});

export default pusher;
