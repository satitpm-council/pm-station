"use server";

import { TrackResponse } from "@station/shared/schema/types";
import SpotifyRequest from "./request";

/// <reference types="spotify-api" />

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
  } = track;
  const { url, height, width } = images[1] ?? images[0];
  return {
    explicit,
    title: name,
    artists: artists.map((v) => v.name),
    duration: duration_ms,
    id,
    preview_url,
    thumbnail_height: height,
    thumbnail_width: width,
    thumbnail_url: url,
    permalink: spotify,
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
