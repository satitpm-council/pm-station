import { python } from "pythonia/src/pythonia/index";
import path from "path";
import type { MusicInfo } from "./types";

const entryPath = path.resolve(process.cwd(), "python", "ytmusic.py");

type PythonEntry = {
  getMusicInfo: (videoId: string[]) => Promise<MusicInfo[]>;
  searchMusic: (query: string[]) => Promise<MusicInfo[]>;
};

let entry: any;

async function init() {
  if (!entry) {
    entry = await python(entryPath);
  }
}

async function call<
  K extends keyof PythonEntry,
  R extends Awaited<ReturnType<PythonEntry[K]>>
>(method: K, ...args: Parameters<PythonEntry[K]>): Promise<R> {
  await init();
  let value = await entry[method](...args);
  if (!Array.isArray(value)) value = value.valueOf();
  exit();
  return value;
}

function exit() {
  // @ts-expect-error Why they don't give the types?
  python.exit();
}

/**
 * Search music on the YouTube Music Library and returns the first matched result.
 * To change properties returned from this function, see the Python entry file.
 * @param query Search queries
 */
export async function searchMusic(...query: string[]): Promise<MusicInfo[]> {
  const results = await call("searchMusic", query);
  return results;
}

/**
 * Get the current music information from the given video ID.
 * To change properties returned from this function, see the Python entry file.
 * @param videoId Video ID to be retrieve
 */
export function getMusicInfo(videoId: string): Promise<MusicInfo>;
/**
 * Get the current music information from the given video ID.
 * To change properties returned from this function, see the Python entry file.
 * @param videoId Video IDs to be retrieve
 */
export function getMusicInfo(...videoId: string[]): Promise<MusicInfo[]>;
export async function getMusicInfo(
  ...videoId: string[]
): Promise<MusicInfo | MusicInfo[]> {
  const results = await call("getMusicInfo", videoId);
  console.log(results);
  if (videoId.length === 1) return results[0];
  return results;
}
