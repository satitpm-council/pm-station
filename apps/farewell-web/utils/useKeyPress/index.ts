import { KeyboardEvent, useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import shimKeyboardEvent from "./shimKeyboardEvent";

type Handler = (ev: KeyboardEvent) => any;
const useKeypress = (keys: string | string[], handler: Handler) => {
  invariant(
    Array.isArray(keys) || typeof keys === "string",
    "Expected `keys` to be an array or string"
  );
  if (Array.isArray(keys)) {
    keys.forEach((key, i) => {
      invariant(
        typeof key === "string",
        `Expected \`keys[${i}]\` to be a string`
      );
    });
  }
  invariant(
    typeof handler === "function" || handler == null,
    "Expected `handler` to be a function"
  );

  const eventListenerRef = useRef<Handler>();

  useEffect(() => {
    eventListenerRef.current = (event) => {
      shimKeyboardEvent(event as any);
      if (Array.isArray(keys) ? keys.includes(event.key) : keys === event.key) {
        handler?.(event);
      }
    };
  }, [keys, handler]);

  useEffect(() => {
    const eventListener = (event: KeyboardEvent) => {
      eventListenerRef.current?.(event);
    };
    window.addEventListener("keydown", eventListener as any);
    return () => {
      window.removeEventListener("keydown", eventListener as any);
    };
  }, []);
};

export default useKeypress;
