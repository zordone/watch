import { useRef, useMemo } from "react";
import _ from "../../common/lodashReduced";

export const useDebouncedCallback = (callback, delay) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const debouncedFn = useMemo(
    () => _.debounce((...args) => callbackRef.current(...args), delay),
    [delay],
  );

  return debouncedFn;
};
