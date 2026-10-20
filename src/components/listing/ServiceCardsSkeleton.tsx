import { Box, Card, Skeleton, Stack } from "@mui/material";

import { t } from "@/config/messages.fa";

const CARD_COUNT = 4;

export function ServiceCardsSkeleton() {
  return (
    <Box aria-busy="true" sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
      <span className="sr-only">{t("common.loading")}</span>
      {Array.from({ length: CARD_COUNT }, (_, index) => (
        <Card key={index} variant="outlined" sx={{ display: "flex", minHeight: 160, gap: 2, p: 2, borderColor: "#dce7e4", borderRadius: 3 }}>
          <Skeleton variant="rounded" width={76} height={76} sx={{ flexShrink: 0, borderRadius: 2.5 }} />
          <Stack spacing={1.5} sx={{ flex: 1 }}>
            <Skeleton variant="text" width="68%" height={26} />
            <Skeleton variant="rounded" width="48%" height={24} />
            <Box sx={{ mt: "auto", display: "flex", justifyContent: "space-between" }}>
              <Skeleton variant="text" width="32%" height={22} />
              <Skeleton variant="text" width="42%" height={22} />
            </Box>
          </Stack>
        </Card>
      ))}
    </Box>
  );
}
