import { useRef, useEffect } from "react";

export const useOnMount = (onMount) => {
  const onMountRef = useRef(onMount);

  useEffect(() => {
    const onUnmount = onMountRef.current();
    return onUnmount;
  }, []);
};
