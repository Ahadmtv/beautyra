"use client";

import { useState, type ComponentProps } from "react";
import { IconButton, InputAdornment } from "@mui/material";

import { t } from "@/config/messages.fa";
import { Input } from "./Input";

type PasswordInputProps = Omit<ComponentProps<typeof Input>, "type" | "endAdornment">;

export function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      {...props}
      type={visible ? "text" : "password"}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? t("auth.password.hide") : t("auth.password.show")}
            aria-pressed={visible}
            edge="end"
            size="small"
          >
            {visible ? (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.5 0 9 7 9 7a15.8 15.8 0 0 1-3 3.8M6.2 6.2C3.9 7.8 3 12 3 12s3.5 7 9 7c1.1 0 2.1-.3 3-.7" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            )}
          </IconButton>
        </InputAdornment>
      }
    />
  );
}
