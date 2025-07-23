import debounce from "lodash/debounce";
import { useRef, useMemo } from "react";

// returns a debounced version of a callback
export const useDebouncedCallback = (callback, delay) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const debouncedFn = useMemo(
    () => debounce((...args) => callbackRef.current(...args), delay),
    [delay],
  );

  return debouncedFn;
};
