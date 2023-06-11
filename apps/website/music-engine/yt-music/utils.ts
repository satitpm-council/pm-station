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

export { isExplicit, isMusicShelf, transformThumbnail };
