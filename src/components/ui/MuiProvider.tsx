"use client";

import type { ReactNode } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: { main: "#0f766e", dark: "#115e59", light: "#eff8f6" },
    background: { default: "#fcf9f7", paper: "#ffffff" },
    text: { primary: "#253a37", secondary: "#5d706c" },
    divider: "#e5dcd6",
    warning: { main: "#a45b32" },
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
