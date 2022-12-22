import { useEffect, useRef, useState } from "react";

export const useScrollAnimation = () => {
  const [top, setTop] = useState(true);
  const layoutShift = useRef(false);
  const timeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const target = document.querySelector<HTMLDivElement>("#app");
    if (timeout.current) clearTimeout(timeout.current);
    if (!target) return;
    const scrollHandler = (): void => {
      if (timeout.current) clearTimeout(timeout.current);
      if (window.innerWidth < 1024) {
        setTop(true);
        return;
      }

      timeout.current = setTimeout(() => {
        const top = target.scrollTop < 250 ? true : false;
        if (layoutShift.current) {
          layoutShift.current = false;
          return;
        }
        setTop((isCurrentlyTop) => {
          const nextValue = isCurrentlyTop
            ? target.scrollTop < 250
            : target.scrollTop < 180;
          return nextValue;
        });
        if (!top) layoutShift.current = true;
      }, 100);
    };
    target.addEventListener("scroll", scrollHandler);
    return () => target.removeEventListener("scroll", scrollHandler);
  }, []);
  return top;
};
