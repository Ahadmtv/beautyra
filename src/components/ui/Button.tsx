import type { ButtonHTMLAttributes } from "react";
import MuiButton from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import { t } from "@/config/messages.fa";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "md" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white shadow-sm hover:bg-primary-hover hover:shadow active:bg-primary-active",
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
    "inline-flex items-center justify-center font-medium transition-all duration-200",
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
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <MuiButton
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={className}
      variant={variant === "primary" ? "contained" : variant === "outline" ? "outlined" : "text"}
      disableElevation
      sx={{
        minHeight: size === "icon" ? 40 : 42,
        minWidth: size === "icon" ? 40 : undefined,
        px: size === "icon" ? 0 : 2,
        gap: 1,
        borderRadius: size === "icon" ? "50%" : 2,
        fontFamily: "inherit",
        fontSize: 14,
        fontWeight: 600,
        textTransform: "none",
        boxShadow: variant === "primary" ? "0 4px 12px rgba(15, 118, 110, 0.16)" : "none",
        color: variant === "primary" ? "#fff" : variant === "outline" ? "#0f766e" : "#172b2a",
        borderColor: variant === "outline" ? "#dce7e4" : undefined,
        backgroundColor: variant === "primary" ? "#0f766e" : undefined,
        "&:hover": {
          boxShadow: variant === "primary" ? "0 6px 18px rgba(15, 118, 110, 0.24)" : "none",
          backgroundColor: variant === "primary" ? "#0d665f" : variant === "outline" ? "#f4f8f7" : "#f4f8f7",
          borderColor: variant === "outline" ? "#0f766e" : undefined,
        },
      }}
      {...rest}
    >
      {loading ? (
        <>
          <CircularProgress size={16} color="inherit" aria-hidden="true" />
          <span>{t("button.loading")}</span>
        </>
      ) : (
        children
      )}
    </MuiButton>
  );
}
