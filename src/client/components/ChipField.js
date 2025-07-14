import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Autocomplete, TextField } from "@mui/material";
import { noop } from "../service/utils";
import _ from "../../common/lodashReduced";

const ChipField = ({
  id,
  value,
  label,
  className,
  options = [],
  maxChips = 5,
  onChange = noop, // ({ id, value })
}) => {
  // if there are no options, we can let the user type freely
  const isFreeSolo = !options.length;

  const handleChange = useCallback(
    (_event, newValue) => {
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

  const filterOptions = useCallback(
    (options, state) => {
      if (value.length >= maxChips) {
        return [];
      }
      const inputValue = state.inputValue.toLowerCase();
      return options.filter((option) => option.toLowerCase().startsWith(inputValue));
    },
    [maxChips, value.length],
  );

  return (
    <Autocomplete
      className={className}
      options={options}
      getOptionLabel={(option) => option}
      renderInput={(params) => <TextField {...params} label={label} placeholder="Type..." />}
      filterOptions={filterOptions}
      value={value}
      onChange={handleChange}
      limitTags={5}
      openOnFocus={false}
      freeSolo={isFreeSolo}
      autoHighlight
      filterSelectedOptions
      multiple
    />
  );
};

ChipField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  options: PropTypes.arrayOf(PropTypes.string),
  maxChips: PropTypes.number,
  className: PropTypes.string,
  onChange: PropTypes.func,
};

export default ChipField;
