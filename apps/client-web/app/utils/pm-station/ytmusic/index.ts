import ytdl from "ytdl-core";
import { videoIdToURL } from "./client";
import type { MusicInfo } from "./types";

/**
 * Search music on the YouTube Music Library and returns the first matched result.
 * To change properties returned from this function, see the Python entry file.
 * @param query Search queries
 */
export async function searchMusic(...query: string[]): Promise<MusicInfo[]> {
  const searchMusics = await import("node-youtube-music").then(
    (c) => c.searchMusics
  );
  const results = await Promise.all(
    query.map<Promise<MusicInfo>>(async (q) => {
      const { youtubeId, artists, duration, thumbnailUrl, title } = (
        await searchMusics(q)
      ).slice(0, 1)[0];
      return {
        title,
        videoId: youtubeId,
        artists,
        duration_seconds: duration?.totalSeconds || 0,
        thumbnails: [
          {
            height: 120,
            width: 120,
            url: thumbnailUrl,
          },
        ],
      } as any;
    })
  );
  return results;
}

/**
 * Get the current music information from the given video ID.
 * To change properties returned from this function, see the Python entry file.
 * @param videoId Video ID to be retrieve
 */
export async function getMusicInfo(videoId: string): Promise<MusicInfo> {
  const { videoDetails } = await ytdl.getBasicInfo(videoIdToURL(videoId));
  const {
    title,
    author,
    channelId,
    lengthSeconds,
    thumbnail: { thumbnails },
  } = videoDetails;
  return {
    artists: [
      {
        name: author.name,
        id: channelId,
      },
    ],
    title,
    videoId,
    duration_seconds: parseInt(lengthSeconds),
    thumbnails,
  };
}
