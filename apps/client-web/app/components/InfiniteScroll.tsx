import { useEffect, useRef } from "react";
import { useInViewport } from "react-in-viewport";
import { useInstantSearch } from "react-instantsearch-hooks-web";

// isReachingEnd === undefined || isReachingEnd === undefined
// canFetch !isReachingEnd && !isRefreshing)
// onFetch setSize((size) => size + 1);

export default function InfiniteScroll({
  isReachingEnd,
  isRefreshing,
  onFetch,
  isEmpty,
}: {
  isReachingEnd?: boolean;
  isRefreshing?: boolean;
  onFetch: () => void;
  isEmpty?: boolean;
}) {
  const { uiState } = useInstantSearch();
  const ref = useRef<HTMLDivElement | null>(null);
  const { inViewport } = useInViewport(ref);
  const initial = useRef<boolean>(false);
  useEffect(() => {
    if (isRefreshing === undefined || isReachingEnd === undefined) return;
    if (!initial.current) {
      initial.current = true;
      return;
    }
    if (inViewport && !isReachingEnd && !isRefreshing) {
      onFetch && onFetch();
    }
  }, [inViewport, isRefreshing, isReachingEnd, onFetch]);

  const query = uiState["station_songrequests"].query;
  return (
    <div ref={ref} className="w-full leading-7">
      {isReachingEnd ? (
        isEmpty ? (
          <>
            <span>ไม่พบคำขอเพลงที่ต้องการ</span>
            <br />
            {query && (
              <span className="text-sm font-light text-gray-300">
                หากต้องการเปิดเพลงนี้ ให้ลองค้นหาใน{" "}
                <a
                  href={`/pm-station/app/songrequests/search?q=${query}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline text-green-500 hover:text-green-400"
                >
                  หน้าส่งรายการคำขอเพลง
                </a>
              </span>
            )}
          </>
        ) : (
          "คำขอทั้งหมดแสดงครบแล้ว"
        )
      ) : (
        "กำลังโหลด..."
      )}
    </div>
  );
}
