import { Movie, Tv } from "@mui/icons-material";
import PropTypes from "prop-types";
import { ItemType } from "../../common/enums";

export const ItemIcon = ({ item, className = "" }) => (
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
