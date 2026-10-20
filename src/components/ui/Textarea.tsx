import type { TextareaHTMLAttributes } from "react";
import { TextField } from "@mui/material";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
};

export function Textarea({ id, label, hint, error, className, required, name, value, defaultValue, rows = 4, ...rest }: TextareaProps) {
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <TextField
      id={id}
      name={name}
      label={label}
      required={required}
      value={value}
      defaultValue={defaultValue}
      rows={rows}
      multiline
      fullWidth
      error={Boolean(error)}
      helperText={message ?? " "}
      className={className}
      slotProps={{
        htmlInput: {
          ...rest,
          "aria-invalid": error ? true : undefined,
          "aria-describedby": message ? messageId : undefined,
        },
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
