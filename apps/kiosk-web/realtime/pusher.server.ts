import Pusher from "pusher";

const pusher = new Pusher({
  appId: "1600278",
  key: "a4028358f5d1ff16ee16",
  secret: "973c4750c8a43da7335a",
  cluster: "ap1",
  useTLS: true,
});

export default pusher;
