import { useRef, useMemo } from "react";
import _ from "../../common/lodashReduced";

const useThrottledCallback = (callback, delay) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const throttledFn = useMemo(
    () => _.throttle((...args) => callbackRef.current(...args), delay),
    [delay],
  );

  return throttledFn;
};

export default useThrottledCallback;
