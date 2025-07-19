import { useEffect, useRef } from "react";
import { useGoBack } from "./useGoBack";
import { useSetHash } from "./useSetHash";

// returns a function to navigate back (or home) and then sets the hash.
// undefined hash is ignored, empty string clears the hash.
export const useGoBackAndSetHash = () => {
  const goBack = useGoBack();
  const setHash = useSetHash();

  const pendingHashRef = useRef(null);

  // add/remove popstate listener so we can update the hash after we navigate back
  useEffect(() => {
    const onPopState = () => {
      if (typeof pendingHashRef.current === "string") {
        const hash = pendingHashRef.current;
        pendingHashRef.current = null;
        setHash(hash);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [setHash]);

  return (hash) => {
    if (typeof hash === "string") {
      pendingHashRef.current = hash.startsWith("#") ? hash : `#${hash}`;
    }
    goBack();
  };
};
