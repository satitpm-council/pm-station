import { interpreter as py } from "node-calls-python";
import path from "path";
import type { MusicInfo } from "./types";

const entryPath = path.join(process.cwd(), "python", "ytmusic.py");

export default class YTMusic {
  private entry;
  constructor() {
    this.entry = py.importSync(entryPath);
  }
  /**
   * Search music on the YouTube Music Library and returns the first matched result.
   * To change properties returned from this function, see the Python entry file.
   * @param query Search query
   */
  searchMusic(query: string): Promise<MusicInfo>;
  /**
   * Search music on the YouTube Music Library and returns the first matched result.
   * To change properties returned from this function, see the Python entry file.
   * @param query Search queries
   */
  searchMusic(...query: string[]): Promise<MusicInfo[]>;
  async searchMusic(...query: string[]): Promise<MusicInfo | MusicInfo[]> {
    const results = (await py.call(
      this.entry,
      "searchMusic",
      query
    )) as MusicInfo[];
    if (query.length === 1) return results[0];
    return results;
  }
  /**
   * Get the current music information from the given video ID.
   * To change properties returned from this function, see the Python entry file.
   * @param videoId Video ID to be retrieve
   */
  getMusicInfo(videoId: string): Promise<MusicInfo>;
  /**
   * Get the current music information from the given video ID.
   * To change properties returned from this function, see the Python entry file.
   * @param videoId Video IDs to be retrieve
   */
  getMusicInfo(...videoId: string[]): Promise<MusicInfo[]>;
  async getMusicInfo(...videoId: string[]): Promise<MusicInfo | MusicInfo[]> {
    const results = (await py.call(
      this.entry,
      "getMusicInfo",
      videoId
    )) as MusicInfo[];
    if (videoId.length === 1) return results[0];
    return results;
  }
}
