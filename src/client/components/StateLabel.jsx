import PropTypes from "prop-types";
import { itemPropType } from "./propTypes";
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
  item: itemPropType,
  className: PropTypes.string,
};
