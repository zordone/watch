import React, { useCallback } from "react";
import { actions } from "../store/store";
import "./Loader.css";

const Loader = () => {
  const onAnimationEnd = useCallback((event) => {
    if (event.target.className !== "Loader") return;
    actions.setIsLoaderFinished(true);
  }, []);

  return (
    <div className="Loader" onAnimationEnd={onAnimationEnd}>
      <div className="Loader-center">
        <div className="Loader-image Loader-bg" />
        <div className="Loader-image Loader-fg" />
      </div>
    </div>
  );
};

export default Loader;
