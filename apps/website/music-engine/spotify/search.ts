import SpotifyRequest from "./request";

/// <reference types="spotify-api" />

export type TrackResponse = Pick<
  SpotifyApi.TrackSearchResponse["tracks"]["items"]["0"],
  "explicit" | "name" | "duration_ms" | "id" | "preview_url" | "uri"
> & {
  artists: string[];
  albumImage: SpotifyApi.ImageObject;
  external_urls: string;
};

export const toTrackResponse = (
  track: SpotifyApi.TrackObjectFull
): TrackResponse => {
  const {
    explicit,
    name,
    artists,
    duration_ms,
    id,
    preview_url,
    album: { images },
    external_urls: { spotify },
    uri,
  } = track;
  return {
    explicit,
    name,
    artists: artists.map((v) => v.name),
    duration_ms,
    id,
    preview_url,
    albumImage: images[1],
    external_urls: spotify,
    uri,
  };
};

/**
 * A server async function that searches for music tracks on Spotify.
 * @param q The search query
 * @returns An array of search results
 */
export const searchTrack = async (q: string) => {
  const {
    tracks: { items },
  } = await SpotifyRequest.get("search", {
    searchParams: {
      q,
      type: "track",
      limit: 12,
      market: "TH",
    },
  }).json<SpotifyApi.TrackSearchResponse>();
  return items.map<TrackResponse>(toTrackResponse);
};

export const getTrack = async (id: string) => {
  const data = await SpotifyRequest.get(
    `tracks/${id}`
  ).json<SpotifyApi.SingleTrackResponse>();
  return toTrackResponse(data);
};
