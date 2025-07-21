import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ItemLoadingFlags, ItemType } from "../../common/enums";
import ItemIcon from "./ItemIcon";
import ScrapeButton from "./ScrapeButton";
import { noop } from "../service/utils";
import { actions } from "../store/store";
import "./Poster.css";

const Poster = ({ item, onPosterSearch = noop, posterSearching = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    actions.setItemLoadingFlag(ItemLoadingFlags.POSTER, !!item.posterUrl);
  }, [item.posterUrl]);

  const onLoaded = useCallback(() => {
    setIsLoaded(true);
    actions.setItemLoadingFlag(ItemLoadingFlags.POSTER, false);
  }, []);

  const onError = useCallback(() => {
    setIsLoaded(false);
    actions.setItemLoadingFlag(ItemLoadingFlags.POSTER, false);
  }, []);

  return (
    <div className="Poster">
      <ItemIcon className="Poster-fallback" item={item} />
      <img
        src={item.posterUrl}
        alt="Poster"
        className={`Poster-image ${isLoaded ? "loaded" : "failed"}`}
        onLoad={onLoaded}
        onError={onError}
      />
      <ScrapeButton
        className="Poster-search"
        ariaLabel="Poster search"
        inProgress={posterSearching}
        onClick={onPosterSearch}
      />
    </div>
  );
};

Poster.propTypes = {
  item: PropTypes.shape({
    type: PropTypes.oneOf(Object.values(ItemType)),
    posterUrl: PropTypes.string,
  }).isRequired,
  posterSearching: PropTypes.bool,
  onPosterSearch: PropTypes.func,
};

export default Poster;
