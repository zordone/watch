import { useRef, useEffect } from "react";

// runs a function on mount. the function can return a cleanup function to run on unmount.
export const useOnMount = (onMount) => {
  const onMountRef = useRef(onMount);

  useEffect(() => {
    // onMount might return an onUnmount cleanup function
    const onUnmount = onMountRef.current();
    return onUnmount;
  }, []);
};
