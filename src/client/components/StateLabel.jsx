import React from "react";
import PropTypes from "prop-types";
import { StateType } from "../../common/enums";
import "./StateLabel.css";

const boldRegex = /^(s\d{2}|\d{4}.\d{2}.\d{2})$/i;

const StateLabel = ({ item, className = "" }) => {
  const { state = {} } = item;
  const { parts = [], message = "" } = state;
  const hasParts = parts?.length > 0;

  return (
    <div className={`StateLabel StateLabel-${state.type} ${className}`}>
      {hasParts
        ? parts.map((part) => (boldRegex.exec(part) ? <strong key={part}>{part}</strong> : part))
        : message}
    </div>
  );
};

StateLabel.propTypes = {
  item: PropTypes.shape({
    state: PropTypes.shape({
      type: PropTypes.oneOf(Object.values(StateType)).isRequired,
      message: PropTypes.string,
      parts: PropTypes.arrayOf(PropTypes.string),
    }),
  }).isRequired,
  className: PropTypes.string,
};

export default StateLabel;
