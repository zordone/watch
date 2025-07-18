import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { ItemType } from "../../common/enums";
import ItemIcon from "./ItemIcon";
import ScrapeButton from "./ScrapeButton";
import { noop } from "../service/utils";
import "./Poster.css";

const Poster = ({ item, onPosterSearch = noop, posterScraping = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const onLoaded = useCallback(() => setIsLoaded(true), []);
  const onError = useCallback(() => setIsLoaded(false), []);

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
        inProgress={posterScraping}
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
  posterScraping: PropTypes.bool,
  onPosterSearch: PropTypes.func,
};

export default Poster;
