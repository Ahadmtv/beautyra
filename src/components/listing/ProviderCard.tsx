import Link from "next/link";
import { Avatar, Box, Card, CardContent, Chip, Rating, Stack, Typography } from "@mui/material";

import { t } from "@/config/messages.fa";
import { numberFormatFa } from "@/lib/format/digits";
import type { ProviderCardView } from "@/lib/api/adapters/provider-card";

export function ProviderCard({ card }: { card: ProviderCardView }) {
  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        height: "100%",
        minHeight: 160,
        color: "inherit",
        textDecoration: "none",
        borderColor: "#dce7e4",
        borderRadius: 3,
        backgroundColor: "#fff",
        transition: "border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease",
        "&:hover": { borderColor: "#0f766e", boxShadow: "0 10px 28px rgba(23, 43, 42, 0.08)", transform: "translateY(-2px)" },
        "&:focus-visible": { outline: "2px solid #0f766e", outlineOffset: 3 },
      }}
    >
      <Link href={`/services/${card.id}`} className="block h-full rounded-xl text-inherit no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
      <CardContent sx={{ display: "flex", width: "100%", minHeight: 160, gap: 2, p: 2, "&:last-child": { pb: 2 } }}>
        <Avatar
          src={card.avatarUrl ?? undefined}
          alt={card.name}
          sx={{ width: 76, height: 76, flexShrink: 0, borderRadius: 2.5, bgcolor: "#e6f4f1", color: "#0f766e", fontSize: 24, fontWeight: 700 }}
        >
          {card.name.slice(0, 1)}
        </Avatar>
        <Stack spacing={1.1} sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" alignItems="center" flexWrap="wrap" gap={0.75}>
            <Typography component="h2" sx={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "inherit", fontSize: 15, fontWeight: 750, color: "#172b2a" }}>
              {card.name}
            </Typography>
            {card.verified && <Chip size="small" label={t("badge.verified")} sx={{ height: 23, bgcolor: "#e6f4f1", color: "#0f766e", fontFamily: "inherit", fontSize: 11, fontWeight: 700 }} />}
          </Stack>
          {card.categoryLabel && (
            <Chip
              size="small"
              label={card.categoryLabel}
              sx={{ alignSelf: "flex-start", maxWidth: "100%", bgcolor: "#f4f8f7", color: "#526764", fontFamily: "inherit", fontSize: 12, "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" } }}
            />
          )}
          <Box sx={{ mt: "auto !important", display: "flex", minHeight: 24, alignItems: "center", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
            {card.neighborhood && <Typography sx={{ fontFamily: "inherit", fontSize: 12, color: "#617472" }}>{card.neighborhood}</Typography>}
            {card.rating !== null && (
              <Stack direction="row" alignItems="center" spacing={0.75} sx={{ direction: "ltr" }}>
                <Rating
                  value={card.rating}
                  readOnly
                  precision={0.1}
                  size="small"
                  aria-label={t("rating.label", { value: numberFormatFa(card.rating) })}
                  sx={{ color: "#dba832", fontSize: 17, "& .MuiRating-iconEmpty": { color: "#e2e8e6" } }}
                />
                <Typography sx={{ fontFamily: "inherit", fontSize: 12, fontWeight: 700, color: "#172b2a" }}>{numberFormatFa(card.rating)}</Typography>
                {card.reviewCount !== null && (
                  <Typography sx={{ fontFamily: "inherit", fontSize: 11, color: "#617472" }}>
                    {t("rating.count", { count: numberFormatFa(card.reviewCount) })}
                  </Typography>
                )}
              </Stack>
            )}
          </Box>
        </Stack>
      </CardContent>
      </Link>
    </Card>
  );
}
