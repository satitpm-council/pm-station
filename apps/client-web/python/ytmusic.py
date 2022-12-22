from concurrent.futures import ThreadPoolExecutor
from typing import List
from ytmusicapi import YTMusic

ytmusic = YTMusic()

dictfilt = lambda x, y: dict([ (i,x[i]) for i in x if i in set(y) ])

def searchMusicExecutor(query: str):
    results = ytmusic.search(query, "songs", None, 1)
    return dictfilt(results[0], ("artists", "thumbnails", "duration_seconds", "title", "videoId"))

# exported to JS
def searchMusic(queries: List[str]):
    # Create a thread pool with a maximum of 5 threads
    with ThreadPoolExecutor(max_workers=5) as executor:
        # Submit tasks to the thread pool
        results = [executor.submit(searchMusicExecutor, query) for query in queries]
        # Wait for all tasks to complete
        return [result.result() for result in results]