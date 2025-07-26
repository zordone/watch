import { TextField } from "@mui/material";

const textFieldSlotProps = { select: { native: true } };

interface SelectFieldProps {
  id: string;
  value: string | undefined;
  label?: string;
  className?: string;
  options?: string[];
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SelectField = ({ options = [], ...props }: SelectFieldProps) => (
  <TextField select {...props} slotProps={textFieldSlotProps}>
    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </TextField>
);
