import { useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router";

// returns a function that sets the hash in the current URL.
// it's a stable function, so adding it to callback/effect dependencies will not trigger them on every render.
export const useSetHash = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const locationRef = useRef(location);
  locationRef.current = location;

  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  const setHash = useCallback((hash) => {
    navigateRef.current(
      {
        pathname: locationRef.current.pathname,
        search: locationRef.current.search,
        hash,
      },
      {
        replace: true,
        viewTransition: false,
      },
    );
  }, []);

  return setHash;
};
