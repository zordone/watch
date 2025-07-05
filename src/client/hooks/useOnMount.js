import { useRef, useEffect } from "react";

const useOnMount = (onMount) => {
  const onMountRef = useRef(onMount);

  useEffect(() => {
    const onUnmount = onMountRef.current();
    return onUnmount;
  }, []);
};

export default useOnMount;
