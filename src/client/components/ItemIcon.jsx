import { Movie, Tv } from "@mui/icons-material";
import PropTypes from "prop-types";
import { ItemType } from "../../common/enums";
import { itemPropType } from "./propTypes";

export const ItemIcon = ({ item, className = "" }) => {
  const Icon = item.type === ItemType.MOVIE ? Movie : Tv;
  return <Icon className={`ItemIcon ${item.type} ${className}`} />;
};

ItemIcon.propTypes = {
  item: itemPropType,
  className: PropTypes.string,
};
