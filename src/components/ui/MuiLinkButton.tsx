"use client";

import type { ReactNode } from "react";
import Button from "@mui/material/Button";
import type { SxProps, Theme } from "@mui/material/styles";
import Link from "next/link";

type MuiLinkButtonProps = {
  href: string;
  children: ReactNode;
  scroll?: boolean;
  variant?: "text" | "outlined" | "contained";
  className?: string;
  sx?: SxProps<Theme>;
};

export function MuiLinkButton({ href, children, scroll, variant = "outlined", className, sx }: MuiLinkButtonProps) {
  return (
    <Button component={Link} href={href} scroll={scroll} variant={variant} className={className} sx={sx}>
      {children}
    </Button>
  );
}
