import { useRef, useMemo } from "react";
import debounce from "lodash/debounce";

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
