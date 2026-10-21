"use client";

import { Alert, Box, Button, Typography } from "@mui/material";
import { t } from "@/config/messages.fa";

export default function ProviderServicesError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Box component="main" dir="rtl" sx={{ width: "100%", maxWidth: 1200, flex: 1, mx: "auto", px: { xs: 2, sm: 3 }, py: { xs: 3, md: 5 } }}>
      <Alert severity="error" sx={{ alignItems: "center", borderRadius: 3, fontFamily: "inherit", "& .MuiAlert-message": { width: "100%" } }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <Typography component="p" sx={{ fontFamily: "inherit", fontWeight: 700 }}>{t("provider.services.loadError")}</Typography>
            <Typography component="p" sx={{ mt: 0.5, fontFamily: "inherit", fontSize: 13 }}>{t("provider.services.loadErrorHint")}</Typography>
          </Box>
          <Button onClick={reset} variant="outlined" sx={{ minHeight: 40, borderColor: "currentColor", color: "inherit", fontFamily: "inherit", fontWeight: 700, textTransform: "none" }}>
            {t("provider.services.retry")}
          </Button>
        </Box>
      </Alert>
    </Box>
  );
}
