import { useEffect, useRef } from "react";
import { useInViewport } from "react-in-viewport";

// isReachingEnd === undefined || isReachingEnd === undefined
// canFetch !isReachingEnd && !isRefreshing)
// onFetch setSize((size) => size + 1);

export default function InfiniteScroll({
  isReachingEnd,
  isRefreshing,
  onFetch,
}: {
  isReachingEnd?: boolean;
  isRefreshing?: boolean;
  onFetch: () => void;
}) {
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
      onFetch();
    }
  }, [inViewport, isRefreshing, isReachingEnd, onFetch]);
  return (
    <div ref={ref} className="w-full">
      {isReachingEnd ? "ข้อมูลแสดงครบแล้ว" : "กำลังโหลด..."}
    </div>
  );
}
