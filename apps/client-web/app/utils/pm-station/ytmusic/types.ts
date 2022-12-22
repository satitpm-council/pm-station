type Artist = {
  name: string;
  id: string;
};

type Thumbnail = {
  url: string;
  width: number;
  height: number;
};

export type MusicInfo = {
  title: string;
  videoId: string;
  artists: Artist[];
  duration_seconds: number;
  thumbnails: Thumbnail[];
};
