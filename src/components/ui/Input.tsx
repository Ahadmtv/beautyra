import type { InputHTMLAttributes } from "react";

import { TextField } from "@mui/material";
import type { ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  endAdornment?: ReactNode;
  reserveHelperText?: boolean;
};

export function Input({ id, label, hint, error, className, endAdornment, reserveHelperText = true, required, name, type, value, defaultValue, ...rest }: InputProps) {
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <TextField
      id={id}
      name={name}
      type={type}
      label={label}
      required={required}
      value={value}
      defaultValue={defaultValue}
      error={Boolean(error)}
      helperText={message ?? (reserveHelperText ? " " : undefined)}
      fullWidth
      variant="outlined"
      className={className}
      slotProps={{
        htmlInput: {
          ...rest,
          "aria-invalid": error ? true : undefined,
          "aria-describedby": message ? messageId : undefined,
        },
        input: { endAdornment },
        formHelperText: { id: messageId, sx: { mx: 0, minHeight: 20 } },
      }}
      sx={{
        fontFamily: "inherit",
        "& .MuiInputBase-input": { fontFamily: "inherit" },
        "& .MuiInputLabel-root": { fontFamily: "inherit" },
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          backgroundColor: "#fff",
          "& fieldset": { borderColor: error ? "#d92d20" : "#dce7e4" },
          "&:hover fieldset": { borderColor: error ? "#d92d20" : "#0f766e" },
          "&.Mui-focused fieldset": { borderWidth: 2, borderColor: error ? "#d92d20" : "#0f766e" },
        },
        "& .MuiInputLabel-root.Mui-focused": { color: error ? "#d92d20" : "#0f766e" },
        "& .MuiFormHelperText-root": { color: error ? "#d92d20" : "#617472", fontFamily: "inherit" },
      }}
    />
  );
}
