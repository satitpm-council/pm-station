export const googleThumbnail = (url: string, size: number) => {
  return url.slice(0, url.lastIndexOf("=")) + "=s" + size;
};
