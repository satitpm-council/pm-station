import { interpreter as py } from "node-calls-python";
import path from "path";
import type { MusicInfo } from "./types";

const entryPath = path.resolve(process.cwd(), "python", "ytmusic.py");
const entry = py.importSync(entryPath);

/**
 * Search music on the YouTube Music Library and returns the first matched result.
 * To change properties returned from this function, see the Python entry file.
 * @param query Search queries
 */
export async function searchMusic(...query: string[]): Promise<MusicInfo[]> {
  const results = (await py.call(entry, "searchMusic", query)) as MusicInfo[];
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
  const results = (await py.call(
    entry,
    "getMusicInfo",
    videoId
  )) as MusicInfo[];
  if (videoId.length === 1) return results[0];
  return results;
}
