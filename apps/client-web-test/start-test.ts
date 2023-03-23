import { setupTestEnv } from "build-config";
import concurrently, { ConcurrentlyCommandInput } from "concurrently";
import { Writable } from "stream";

// Set the process environment to "TEST"
process.env.NODE_ENV = "TEST";
setupTestEnv("client-web");

const isDevMode = process.argv.includes("--dev");

// Start the TypeScript compiler for Firebase functions
const tscCommand: ConcurrentlyCommandInput = {
  command: `yarn workspace @station/firebase-functions ${
    isDevMode ? "watch" : "build"
  }`,
  name: "tsc",
  prefixColor: "bgBlue.bold",
};

// Start the Remix development server
const remixDevServer: ConcurrentlyCommandInput = {
  command: "yarn workspace client-web dev",
  name: "remix",
  prefixColor: "bgMagenta.bold",
};

// Start the Firebase emulator and run Cypress tests
const execCommand = isDevMode
  ? "yarn workspace client-web-test open"
  : "yarn workspace client-web-test start";
const firebaseEmulator: ConcurrentlyCommandInput = {
  command: `yarn workspace @station/firebase ${
    execCommand
      ? `test:exec ${
          isDevMode ? "--ui" : "--export-on-exit=exports"
        } "${execCommand}"`
      : "start"
  }`,
  name: "tests",
  prefixColor: "bgGreen.bold",
};

const filteredFromConsole = [
  "GET",
  "POST",
  "OPTIONS",
  "Processing",
  "Finished",
];

class FilterStream extends Writable {
  private cache: string = "";
  constructor(private outputStream: any) {
    super();
  }

  _write(chunk: Buffer, encoding: string, callback: Function) {
    const data = chunk.toString();
    if (/\[.*\]/.test(data)) {
      this.cache += data;
      return callback();
    }
    if (filteredFromConsole.some((str) => data.includes(str))) {
      callback();
    } else {
      this.outputStream.write(this.cache + data);
      callback();
    }
    this.cache = "";
  }
}

const { result } = concurrently(
  [tscCommand, remixDevServer, firebaseEmulator],
  {
    successCondition: "last",
    killOthers: ["failure"],
    outputStream: new FilterStream(process.stdout),
  }
);

result.then(
  () => {},
  () => {}
);
