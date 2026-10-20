"use client";

import type { ReactNode } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: { main: "#0f766e", dark: "#0d665f", light: "#e6f4f1" },
    background: { default: "#f7faf9", paper: "#ffffff" },
    text: { primary: "#172b2a", secondary: "#617472" },
    divider: "#dce7e4",
    warning: { main: "#dba832" },
  },
  shape: { borderRadius: 4 },
  typography: {
    fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif",
    button: { fontWeight: 600, textTransform: "none" },
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          left: "auto",
          right: 0,
          transformOrigin: "top right",
          "&.MuiInputLabel-outlined": { transform: "translate(-14px, 16px) scale(1)" },
          "&.MuiInputLabel-outlined.MuiInputLabel-shrink": { transform: "translate(-14px, -9px) scale(0.75)" },
          "&.MuiInputLabel-sizeSmall.MuiInputLabel-outlined": { transform: "translate(-14px, 9px) scale(1)" },
          "&.MuiInputLabel-sizeSmall.MuiInputLabel-outlined.MuiInputLabel-shrink": { transform: "translate(-14px, -6px) scale(0.75)" },
        },
      },
    },
  },
});

export function MuiProvider({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
