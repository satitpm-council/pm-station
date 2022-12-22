export const videoIdToURL = (videoId: string) => {
  return `https://www.youtube.com/watch?v=${videoId}`;
};

export const urlToVideoID = (url: string) => {
  return /(?:[?&]v=|\/embed\/|\/1\/|\/v\/|https:\/\/(?:www\.)?youtu\.be\/)([^&\n?#]+)/.exec(
    url
  )?.[1];
};
