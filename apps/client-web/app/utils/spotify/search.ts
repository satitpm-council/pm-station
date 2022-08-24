import SpotifyRequest from "./request";

/// <reference types="spotify-api" />

type TrackResponse = Pick<
  SpotifyApi.TrackSearchResponse["tracks"]["items"]["0"],
  "explicit" | "name" | "duration_ms" | "id" | "preview_url"
> & {
  artists: string[];
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
      limit: 10,
    },
  });
  return items.map<TrackResponse>(
    ({ explicit, name, artists, duration_ms, id, preview_url }) => {
      return {
        explicit,
        name,
        artists: artists.map((v) => v.name),
        duration_ms,
        id,
        preview_url,
      };
    }
  );
};
