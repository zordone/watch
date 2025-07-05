import React, { useCallback } from "react";
import PropTypes from "prop-types";
import ChipInput from "material-ui-chip-input";
import _ from "../../common/lodashReduced";
import "./ChipArrayInput.css";
import { noop } from "../service/utils";

const ChipArrayInput = ({ value, onChange, id, className, ...rest }) => {
  const fireOnChanged = useCallback(
    (newValue) => {
      if (_.isEqual(value, newValue)) {
        return;
      }
      const event = {
        target: { id, value: newValue },
      };
      onChange(event);
    },
    [value, onChange, id],
  );

  const onAdd = useCallback(
    (item) => {
      fireOnChanged(value.concat(item));
    },
    [value, fireOnChanged],
  );

  const onDelete = useCallback(
    (item, index) => {
      const newValue = [...value];
      newValue.splice(index, 1);
      fireOnChanged(newValue);
    },
    [value, fireOnChanged],
  );

  return (
    <ChipInput
      onAdd={onAdd}
      onDelete={onDelete}
      className={`ChipArrayInput ${className}`}
      classes={{
        chipContainer: "chipContainer",
        chip: "chip",
        label: "label",
      }}
      {...rest}
    />
  );
};

ChipArrayInput.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.shape({}),
  label: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func,
};

ChipArrayInput.defaultProps = {
  id: undefined,
  className: "",
  style: {},
  label: undefined,
  onChange: noop,
};

export default ChipArrayInput;
