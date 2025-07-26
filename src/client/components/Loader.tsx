import { useCallback, useRef } from "react";
import { actions } from "../store/store";
import "./Loader.css";

export const Loader = () => {
  const loaderRef = useRef<HTMLDivElement>(null);

  const onAnimationEnd = useCallback((event: React.AnimationEvent<HTMLDivElement>) => {
    // there are multiple animations on the children as well,
    // but we're only finished when the main loader animation ends
    if (event.target !== loaderRef.current) return;
    actions.setIsLoaderFinished(true);
  }, []);

  return (
    <div className="Loader" onAnimationEnd={onAnimationEnd} ref={loaderRef}>
      <div className="Loader-center">
        <div className="Loader-image Loader-bg" />
        <div className="Loader-image Loader-fg" />
      </div>
    </div>
  );
};
