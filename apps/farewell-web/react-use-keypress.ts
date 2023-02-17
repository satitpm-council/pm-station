import { KeyboardEvent, RefObject } from "react";

type KeyOrKeys = string | string[];

type KeypressHandler = (event: KeyboardEvent) => void;

interface UseKeypress {
  (keys: KeyOrKeys, handler?: KeypressHandler | null): void;
}

declare const useKeypress: UseKeypress;

export default useKeypress;
