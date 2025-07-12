import React from "react";
import PropTypes from "prop-types";
import { Movie, Tv } from "@mui/icons-material";
import { ItemType } from "../../common/enums";

const ItemIcon = ({ item, className = "" }) => (
  <span className={`ItemIcon ${item.type} ${className}`}>
    {item.type === ItemType.MOVIE ? <Movie /> : <Tv />}
  </span>
);

ItemIcon.propTypes = {
  item: PropTypes.shape({
    type: PropTypes.oneOf(Object.values(ItemType)),
  }).isRequired,
  className: PropTypes.string,
};

export default ItemIcon;
