"use client";

import Link from "next/link";
import { ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";

export function CategoryLinkItem({ href, label, selected }: { href: string; label: string; selected: boolean }) {
  return (
    <ListItemButton
      component={Link}
      href={href}
      scroll={false}
      selected={selected}
      sx={{
        minHeight: 44,
        gap: 1,
        px: 1.5,
        py: 0.75,
        borderRadius: 2,
        color: selected ? "#0f766e" : "#435653",
        "&.Mui-selected": { bgcolor: "#e6f4f1", color: "#0f766e", "&:hover": { bgcolor: "#e6f4f1" } },
        "&:hover": { bgcolor: "#f4f8f7", color: "#0f766e" },
      }}
    >
      <ListItemIcon sx={{ minWidth: 18, mr: 0, ml: 1 }}>
        <span
          aria-hidden="true"
          style={{
            width: selected ? 8 : 6,
            height: selected ? 8 : 6,
            borderRadius: "50%",
            backgroundColor: selected ? "#0f766e" : "#bdcbc7",
          }}
        />
      </ListItemIcon>
      <ListItemText
        primary={<Typography sx={{ fontFamily: "inherit", fontSize: 14, fontWeight: selected ? 700 : 500 }}>{label}</Typography>}
      />
    </ListItemButton>
  );
}
