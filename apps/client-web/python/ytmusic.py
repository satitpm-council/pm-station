from concurrent.futures import ThreadPoolExecutor
from typing import Any, Callable, List, TypedDict
from ytmusicapi import YTMusic


def dictfilt(x, y): return dict([(i, x[i]) for i in x if i in set(y)])


class Artist(TypedDict):
    name: str
    id: str


class Thumbnail(TypedDict):
    url: str
    width: int
    height: int


class MusicInfo(TypedDict):
    title: str
    videoId: str
    artists: List[Artist]
    duration_seconds: int
    thumbnails: List[Thumbnail]


ytmusic = YTMusic()


def searchMusicExecutor(query: str) -> MusicInfo:
    results = ytmusic.search(query, "songs")
    return dictfilt(results[0], ("artists", "thumbnails", "duration_seconds", "title", "videoId"))


def getMusicInfoExecutor(id: str):
    result = ytmusic.get_song(id)
    returns: MusicInfo = {
        "title": result["videoDetails"]["title"],
        "videoId": result["videoDetails"]["videoId"],
        "artists": [{
            "name": result["videoDetails"]["author"],
            "id": result["videoDetails"]["channelId"]
        }],
        "duration_seconds": int(result["videoDetails"]["lengthSeconds"]),
        "thumbnails": result["videoDetails"]["thumbnail"]["thumbnails"]
    }
    return returns


def runAsWorker(fn: Callable, inputs: List[Any]):
    # Create a thread pool with a maximum of 5 threads
    with ThreadPoolExecutor(max_workers=5) as executor:
        # Submit tasks to the thread pool
        results = [executor.submit(fn, param)
                   for param in inputs]
        # Wait for all tasks to complete
        return [result.result() for result in results]


def searchMusic(queries: List[str]):
    return runAsWorker(searchMusicExecutor, queries)


def getMusicInfo(videoIds: List[str]):
    return runAsWorker(getMusicInfoExecutor, videoIds)
