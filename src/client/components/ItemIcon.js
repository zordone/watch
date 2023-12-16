import React from "react";
import PropTypes from "prop-types";
import { ItemType } from "../../common/enums";

const ItemIcon = ({ item, className }) => (
  <i className={`ItemIcon material-icons ${item.type} ${className}`}>
    {item.type === ItemType.MOVIE ? "movie_creation" : "live_tv"}
  </i>
);

ItemIcon.propTypes = {
  item: PropTypes.shape({
    type: PropTypes.oneOf(Object.values(ItemType)),
  }).isRequired,
  className: PropTypes.string,
};

ItemIcon.defaultProps = {
  className: "",
};

export default ItemIcon;
