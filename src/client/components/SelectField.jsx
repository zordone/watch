import { TextField } from "@mui/material";
import PropTypes from "prop-types";

const textFieldSlotProps = { select: { native: true } };

export const SelectField = ({ options = [], ...props }) => (
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
