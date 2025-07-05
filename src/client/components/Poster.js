import React from "react";
import PropTypes from "prop-types";
import { ItemType } from "../../common/enums";
import ItemIcon from "./ItemIcon";
import ScrapeButton from "./ScrapeButton";
import { noop } from "../service/utils";
import "./Poster.css";

const Poster = ({ item, onPosterSearch, posterScraping }) => {
  const style = {};
  if (item.posterUrl) {
    style.background = `url(${item.posterUrl}) no-repeat center / cover`;
  }
  return (
    <div className="Poster">
      <ItemIcon className="Poster-fallback" item={item} />
      <img src={item.posterUrl} alt="Poster" className="Poster-image" />
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

Poster.defaultProps = {
  posterScraping: false,
  onPosterSearch: noop,
};

export default Poster;
