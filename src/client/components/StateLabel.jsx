import PropTypes from "prop-types";
import { StateType } from "../../common/enums";
import "./StateLabel.css";

const boldRegex = /^(s\d{2}|\d{4}.\d{2}.\d{2})$/i;

export const StateLabel = ({ item, className = "" }) => {
  const { state = {} } = item;
  const { parts = [] } = state;

  return (
    <div className={`StateLabel StateLabel-${state.type} ${className}`}>
      {parts.map((part) => (boldRegex.exec(part) ? <strong key={part}>{part}</strong> : part))}
    </div>
  );
};

StateLabel.propTypes = {
  item: PropTypes.shape({
    state: PropTypes.shape({
      type: PropTypes.oneOf(Object.values(StateType)).isRequired,
      parts: PropTypes.arrayOf(PropTypes.string),
    }),
  }).isRequired,
  className: PropTypes.string,
};
