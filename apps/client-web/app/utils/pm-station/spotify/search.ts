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

export const searchTrack = async (q: string) => {
  const {
    data: {
      tracks: { items },
    },
  } = await SpotifyRequest.get<SpotifyApi.TrackSearchResponse>("/search", {
    params: {
      q,
      type: "track",
      limit: 12,
      market: "TH",
    },
  });
  return items.map<TrackResponse>(toTrackResponse);
};

export const getTrack = async (id: string) => {
  const { data } = await SpotifyRequest.get<SpotifyApi.SingleTrackResponse>(
    `/tracks/${id}`
  );
  return toTrackResponse(data);
};
