import { interpreter as py } from "node-calls-python";
import path from "path";

type Artist = {
  name: string;
  id: string;
};

type Thumbnail = {
  url: string;
  width: number;
  height: number;
};

export type SearchMusicResult = {
  title: string;
  videoId: string;
  artists: Artist[];
  duration_seconds: number;
  thumbnails: Thumbnail[];
};

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
  searchMusic(query: string): Promise<SearchMusicResult>;
  /**
   * Search music on the YouTube Music Library and returns the first matched result.
   * To change properties returned from this function, see the Python entry file.
   * @param query Search queries
   */
  searchMusic(...query: string[]): Promise<SearchMusicResult[]>;
  async searchMusic(
    ...query: string[]
  ): Promise<SearchMusicResult | SearchMusicResult[]> {
    const results = await Promise.all(
      query.map(
        async (q) =>
          py.call(this.entry, "searchMusic", q) as Promise<SearchMusicResult>
      )
    );
    if (query.length === 1) return results[0];
    return results;
  }
}
