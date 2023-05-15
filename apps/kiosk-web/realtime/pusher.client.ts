import Pusher from "pusher-js";
import { ControllerSendEvents } from "./controller/server";

const pusher = new Pusher<ControllerSendEvents>("a4028358f5d1ff16ee16", {
  cluster: "ap1",
});

export default pusher;
