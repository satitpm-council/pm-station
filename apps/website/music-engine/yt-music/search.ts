import { Innertube } from "youtubei.js";
import type { YTNode } from "youtubei.js/dist/src/parser/helpers";
import type { MusicShelf } from "youtubei.js/dist/src/parser/nodes";
import type { Thumbnail } from "youtubei.js/dist/src/parser/misc";

const isMusicShelf = (x: YTNode): x is MusicShelf => {
  return x.type === "MusicShelf";
};

const isExplicit = (x: YTNode) => {
  return (
    x.type === "MusicInlineBadge" &&
    x.hasKey("icon_type") &&
    x["icon_type"] === "MUSIC_EXPLICIT_BADGE"
  );
};

const transformThumbnail = (thumbnail: Thumbnail): Thumbnail => {
  if (thumbnail.width !== thumbnail.height) {
    console.warn("Thumbnail width and height are not equal", thumbnail);
  }
  const size = thumbnail.height;
  const desiredSize = 300;
  return {
    url: thumbnail.url.replace(
      `=w${size}-h${size}-`,
      `=w${desiredSize}-h${desiredSize}-`
    ),
    width: desiredSize,
    height: desiredSize,
  };
};

/**
 * A server async function that searches for music on YouTube.
 * @param q The search query
 * @returns An array of search results
 */
export async function searchMusic(q: string) {
  const youtube = await Innertube.create({
    lang: "th",
    location: "TH",
    retrieve_player: false,
    fetch: (url, init) => {
      return fetch(url, {
        ...(init ?? {}),
        cache: undefined,
        next: {
          revalidate: 15 * 60,
        },
      });
    },
  });

  const search = await youtube.music.search(q, {
    type: "song",
  });

  const results = search.contents?.find(isMusicShelf)?.contents;
  if (results) {
    const sanitized = results.map((result) => {
      return {
        title: result.title,
        id: result.id,
        duration: result.duration?.seconds,
        artists: result.artists?.map((artist) => artist.name),
        thumbnails: transformThumbnail(result.thumbnails?.[0]),
        explicit: result.badges.some(isExplicit),
      };
    });
    return sanitized;
  }
  return [];
}
