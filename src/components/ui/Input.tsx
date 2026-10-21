import type { InputHTMLAttributes } from "react";
import { TextField } from "@mui/material";
import type { ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  compact?: boolean;
  topLabel?: boolean;
  reserveHelperText?: boolean;
};

export function Input({
  id,
  label,
  hint,
  error,
  className,
  startAdornment,
  endAdornment,
  compact = false,
  topLabel = false,
  reserveHelperText = true,
  required,
  name,
  type,
  value,
  defaultValue,
  ...rest
}: InputProps) {
  const messageId = `${id}-message`;
  const message = error ?? hint;
  const field = (
    <TextField
      id={id}
      name={name}
      type={type}
      label={topLabel ? undefined : label}
      required={required}
      value={value}
      defaultValue={defaultValue}
      error={Boolean(error)}
      helperText={message ?? (reserveHelperText ? " " : undefined)}
      fullWidth
      variant="outlined"
      size={compact || topLabel ? "small" : "medium"}
      className={topLabel ? undefined : className}
      slotProps={{
        htmlInput: {
          ...rest,
          "aria-required": required ? true : undefined,
          "aria-invalid": error ? true : undefined,
          "aria-describedby": message ? messageId : undefined,
        },
        input: { startAdornment, endAdornment },
        formHelperText: { id: messageId, sx: { mx: 0, minHeight: message || reserveHelperText ? 20 : 0 } },
      }}
      sx={{
        fontFamily: "inherit",
        "& .MuiInputAdornment-positionStart": { marginInlineEnd: 1, marginRight: 0 },
        "& .MuiInputAdornment-positionEnd": { marginInlineStart: 1, marginLeft: 0 },
        "& .MuiInputBase-input": { fontFamily: "inherit", textAlign: rest.dir === "ltr" ? "start" : undefined, fontVariantNumeric: rest.inputMode === "numeric" ? "tabular-nums" : undefined, ...(compact || topLabel ? { paddingBlock: "10px" } : {}) },
        "& .MuiInputLabel-root": { fontFamily: "inherit" },
        "& .MuiOutlinedInput-root": {
          minHeight: compact || topLabel ? 44 : undefined,
          borderRadius: compact || topLabel ? "10px" : 2,
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

  if (!topLabel) return field;

  return (
    <div className={`flex min-w-0 flex-col gap-1 ${className ?? ""}`}>
      <label htmlFor={id} className="text-sm font-medium leading-6 text-text">
        {label}{required && <span aria-hidden="true" className="ms-1 text-danger">*</span>}
      </label>
      {field}
    </div>
  );
}
