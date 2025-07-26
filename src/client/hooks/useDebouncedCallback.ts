import debounce from "lodash/debounce";
import { useRef, useMemo } from "react";

// returns a debounced wrapper of a callback
export const useDebouncedCallback = <Args extends unknown[], Return>(
  callback: (...args: Args) => Return,
  delay: number,
): ((...args: Args) => void) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const debouncedFn = useMemo(
    () =>
      debounce((...args: Args) => {
        callbackRef.current(...args);
      }, delay),
    [delay],
  );

  return debouncedFn;
};
