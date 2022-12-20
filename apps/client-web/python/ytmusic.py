from ytmusicapi import YTMusic

ytmusic = YTMusic()

dictfilt = lambda x, y: dict([ (i,x[i]) for i in x if i in set(y) ])

def searchMusic(query: str):
    results = ytmusic.search(query, "songs", None, 1)
    return dictfilt(results[0], ("artists", "thumbnails", "duration_seconds", "title", "videoId"))

