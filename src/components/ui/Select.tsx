import type { SelectHTMLAttributes } from "react";

type SelectOption = { value: string; label: string };

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: string;
  options: ReadonlyArray<SelectOption>;
  placeholder?: string;
  error?: string;
};

export function Select({
  id,
  label,
  options,
  placeholder,
  error,
  className,
  ...rest
}: SelectProps) {
  const messageId = `${id}-message`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
      </label>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? messageId : undefined}
        className={[
          "h-10 rounded-md border bg-white ps-3 pe-8 text-sm text-text",
          error ? "border-danger" : "border-border",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={messageId} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
