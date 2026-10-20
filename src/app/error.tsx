"use client";

import { Alert, Box, Paper, Stack, Typography } from "@mui/material";

import { t } from "@/config/messages.fa";
import { Button } from "@/components/ui/Button";


export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <Box component="main" sx={{ width: "100%", maxWidth: 1080, flex: 1, mx: "auto", px: { xs: 2, sm: 3 }, py: { xs: 4, md: 6 } }}>
      <Paper elevation={0} sx={{ maxWidth: 640, mx: "auto", p: { xs: 2.5, sm: 4 }, border: "1px solid #dce7e4", borderRadius: 3, bgcolor: "#fff" }}>
        <Stack spacing={2.5}>
          <Typography component="h1" variant="h6" sx={{ fontFamily: "inherit", fontWeight: 750, color: "#172b2a" }}>{t("error.title")}</Typography>
          <Alert severity="error" sx={{ borderRadius: 2, fontFamily: "inherit", "& .MuiAlert-message": { fontFamily: "inherit" } }}>{t("home.loadError")}</Alert>
          <Button onClick={reset}>{t("common.retry")}</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
