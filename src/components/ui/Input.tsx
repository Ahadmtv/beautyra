import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
};

export function Input({ id, label, hint, error, className, ...rest }: InputProps) {
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className={[
          "h-10 rounded-md border bg-white px-3 text-sm text-text placeholder:text-text-muted",
          error ? "border-danger" : "border-border",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      />
      {message && (
        <p id={messageId} className={error ? "text-sm text-danger" : "text-sm text-text-muted"}>
          {message}
        </p>
      )}
    </div>
  );
}
