function forceDownload(blobUrl: string, filename: string) {
  let a: any = document.createElement("a");
  a.download = filename;
  a.href = blobUrl;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function downloadPhoto(url: string, filename: string) {
  if (!filename) filename = url.split("\\").pop()!.split("/").pop()!;
  const canDownload = "download" in document.createElement("a");
  // don't know what happened. force download on server for all devices
  if (canDownload) {
    // use server download as a fallback
    const params = new URLSearchParams();
    params.set("url", url);
    params.set("filename", filename);
    window.location.replace("/api/download?" + params.toString());
    return;
  }
  fetch(url, {
    headers: new Headers({
      Origin: location.origin,
    }),
    mode: "cors",
  })
    .then((response) => response.blob())
    .then((blob) => {
      let blobUrl = window.URL.createObjectURL(blob);
      forceDownload(blobUrl, filename);
    })
    .catch((e) => console.error(e));
}
