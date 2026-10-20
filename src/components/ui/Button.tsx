import type { ButtonHTMLAttributes } from "react";
import { t } from "@/config/messages.fa";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "md" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover active:bg-primary-active",
  outline: "border border-border bg-white text-text hover:bg-surface",
  ghost: "text-text hover:bg-surface",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "h-10 gap-2 rounded-md px-4 text-sm",
  icon: "size-10 rounded-full",
};

export function buttonClassName({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}): string {
  return [
    "inline-flex items-center justify-center font-medium transition-colors duration-200",
    "disabled:cursor-not-allowed disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

export function Button({
  variant,
  size,
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClassName({ variant, size, className })}
      {...rest}
    >
      {loading ? (
        <>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-4 animate-spin"
            fill="none"
          >
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span>{t("button.loading")}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
