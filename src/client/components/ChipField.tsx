import { Autocomplete, FilterOptionsState, TextField } from "@mui/material";
import { SyntheticEvent, useCallback } from "react";
import { noop } from "../service/utils";

interface ChipFieldProps {
  id: string;
  label: string;
  value: string[];
  options?: string[];
  maxChips?: number;
  className?: string;
  onChange?: (id: string, newValue: string[]) => void;
}

export const ChipField = ({
  id,
  value,
  label,
  className,
  options = [],
  maxChips = 5,
  onChange = noop,
}: ChipFieldProps) => {
  // if there are no options, we can let the user type freely
  const isFreeSolo = !options.length;

  const handleChange = useCallback(
    (_event: SyntheticEvent, newValue: string[]) => {
      onChange(id, newValue);
    },
    [onChange, id],
  );

  const filterOptions = useCallback(
    (options: string[], state: FilterOptionsState<string>) => {
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
