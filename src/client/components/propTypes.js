import PropTypes from "prop-types";
import { StateType, ValiType } from "../../common/enums";

export const itemPropType = PropTypes.shape({
  _id: PropTypes.string,
  title: PropTypes.string.isRequired,
  genres: PropTypes.arrayOf(PropTypes.string).isRequired,
  state: PropTypes.shape({
    type: PropTypes.oneOf(Object.values(StateType)),
  }),
  notes: PropTypes.string,
  withVali: PropTypes.oneOf(Object.values(ValiType)),
}).isRequired;
