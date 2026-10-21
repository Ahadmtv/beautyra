import type { ChangeEventHandler } from "react";
import { FormControl, FormHelperText, InputLabel, NativeSelect, OutlinedInput } from "@mui/material";

type SelectOption = { value: string; label: string };

type SelectProps = {
  id: string;
  label: string;
  options: ReadonlyArray<SelectOption>;
  placeholder?: string;
  error?: string;
  className?: string;
  required?: boolean;
  name?: string;
  disabled?: boolean;
  defaultValue?: string | number | readonly string[];
  value?: string | number | readonly string[];
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  "aria-label"?: string;
};

export function Select({ id, label, options, placeholder, error, className, required, name, disabled, defaultValue, value, onChange, "aria-label": ariaLabel }: SelectProps) {
  const messageId = `${id}-message`;

  return (
    <FormControl
      fullWidth
      required={required}
      error={Boolean(error)}
      className={className}
      sx={{
        fontFamily: "inherit",
        "& .MuiInputLabel-root": { fontFamily: "inherit" },
        "& .MuiNativeSelect-select": { fontFamily: "inherit", minHeight: "1.25rem" },
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          backgroundColor: "#fff",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: error ? "#d92d20" : "#dce7e4" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: error ? "#d92d20" : "#0f766e" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderWidth: 2, borderColor: error ? "#d92d20" : "#0f766e" },
        },
        "& .MuiInputLabel-root.Mui-focused": { color: error ? "#d92d20" : "#0f766e" },
        "& .MuiFormHelperText-root": { mx: 0, minHeight: 20, color: error ? "#d92d20" : "#617472", fontFamily: "inherit" },
      }}
    >
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <NativeSelect
        name={name}
        disabled={disabled}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        input={<OutlinedInput label={label} />}
        inputProps={{ id, "aria-describedby": error ? messageId : undefined, "aria-label": ariaLabel }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </NativeSelect>
      <FormHelperText id={messageId}>{error ?? " "}</FormHelperText>
    </FormControl>
  );
}
