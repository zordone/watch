import React from "react";
import PropTypes from "prop-types";
import { TextField } from "@mui/material";

const textFieldSlotProps = { select: { native: true } };

const SelectField = ({ options = [], ...props }) => (
  <TextField select {...props} slotProps={textFieldSlotProps}>
    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </TextField>
);

SelectField.propTypes = {
  id: PropTypes.string,
  style: PropTypes.shape({}),
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.string),
};

export default SelectField;
