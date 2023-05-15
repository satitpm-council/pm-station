import { Metadata } from "next";
import ConnectionStatus from "../components/ConnectionStatus";
import Queue from "../components/Queue";

export const metadata: Metadata = {
  title: "คิวเพลง",
};

export default function QueuePage() {
  return (
    <>
      <div className="flex flex-row flex-wrap gap-4 items-center">
        <h1 className="font-bold text-4xl flex-grow">คิวเพลง</h1>
        <ConnectionStatus />
      </div>
      <Queue />
    </>
  );
}
