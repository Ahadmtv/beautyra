import { Box, Card, Skeleton, Stack } from "@mui/material";

import { t } from "@/config/messages.fa";

const CARD_COUNT = 6;

export function ServiceCardsSkeleton() {
  return (
    <Box aria-busy="true" sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", "@media (min-width: 768px)": { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }, "@media (min-width: 1200px)": { gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }, gap: { xs: 1.5, md: 2.5 }, "@media (prefers-reduced-motion: reduce)": { "& .MuiSkeleton-root": { animation: "none" } } }}>
      <span className="sr-only">{t("common.loading")}</span>
      {Array.from({ length: CARD_COUNT }, (_, index) => (
        <Card key={index} variant="outlined" sx={{ overflow: "hidden", borderColor: "#e9ded7", borderRadius: "16px", bgcolor: "#fff" }}>
          <Skeleton animation="wave" variant="rectangular" height={112} sx={{ bgcolor: "#f1f3ef" }} />
          <Stack spacing={1.4} sx={{ p: 2 }}>
            <Skeleton animation="wave" variant="text" width="67%" height={27} />
            <Skeleton animation="wave" variant="rounded" width="38%" height={26} sx={{ borderRadius: 8 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
              <Skeleton animation="wave" variant="text" width="38%" height={24} />
              <Skeleton animation="wave" variant="text" width="42%" height={24} />
            </Box>
            <Skeleton animation="wave" variant="rounded" height={42} sx={{ mt: 1, borderRadius: "11px" }} />
          </Stack>
        </Card>
      ))}
    </Box>
  );
}
