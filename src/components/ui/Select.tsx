"use client";

import type { ChangeEventHandler, SVGProps } from "react";
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
  compact?: boolean;
  topLabel?: boolean;
  reserveHelperText?: boolean;
  "aria-label"?: string;
};

function SelectChevron(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

export function Select({
  id,
  label,
  options,
  placeholder,
  error,
  className,
  required,
  name,
  disabled,
  defaultValue,
  value,
  onChange,
  compact = false,
  topLabel = false,
  reserveHelperText = true,
  "aria-label": ariaLabel,
}: SelectProps) {
  const messageId = `${id}-message`;
  const showHelperText = Boolean(error) || reserveHelperText;
  const control = (
    <FormControl
      fullWidth
      required={required}
      error={Boolean(error)}
      className={topLabel ? undefined : className}
      size={compact || topLabel ? "small" : "medium"}
      sx={{
        fontFamily: "inherit",
        "& .MuiInputLabel-root": { fontFamily: "inherit" },
        "& .MuiNativeSelect-select": {
          minHeight: compact || topLabel ? "44px" : "1.25rem",
          boxSizing: "border-box",
          paddingInlineStart: "14px !important",
          paddingInlineEnd: "38px !important",
          textAlign: "start",
          direction: "rtl",
          appearance: "none",
          lineHeight: 1.5,
          fontFamily: "inherit",
        },
        "& .MuiNativeSelect-icon": { insetInlineEnd: 10, insetInlineStart: "auto", color: "#617472" },
        "& .MuiOutlinedInput-root": {
          minHeight: compact || topLabel ? 44 : undefined,
          borderRadius: compact || topLabel ? "10px" : 2,
          backgroundColor: "#fff",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: error ? "#d92d20" : "#dce7e4" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: error ? "#d92d20" : "#0f766f" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderWidth: 2, borderColor: error ? "#d92d20" : "#0f766f" },
        },
        "& .MuiInputLabel-root.Mui-focused": { color: error ? "#d92d20" : "#0f766e" },
        "& .MuiFormHelperText-root": { mx: 0, minHeight: showHelperText ? 20 : 0, color: error ? "#d92d20" : "#617472", fontFamily: "inherit" },
      }}
    >
      {!topLabel && <InputLabel htmlFor={id} shrink>{label}</InputLabel>}
      <NativeSelect
        name={name}
        disabled={disabled}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        IconComponent={SelectChevron}
        input={<OutlinedInput label={topLabel ? undefined : label} />}
        inputProps={{
          id,
          "aria-required": required ? true : undefined,
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? messageId : undefined,
          "aria-label": ariaLabel,
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </NativeSelect>
      {showHelperText && <FormHelperText id={messageId}>{error ?? " "}</FormHelperText>}
    </FormControl>
  );

  if (!topLabel) return control;

  return (
    <div className={`flex min-w-0 flex-col gap-1 ${className ?? ""}`}>
      <label htmlFor={id} className="text-sm font-medium leading-6 text-text">
        {label}{required && <span aria-hidden="true" className="ms-1 text-danger">*</span>}
      </label>
      {control}
    </div>
  );
}
