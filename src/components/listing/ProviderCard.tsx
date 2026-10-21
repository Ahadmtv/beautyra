import Link from "next/link";
import { Avatar, Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";

import { t } from "@/config/messages.fa";
import { numberFormatFa } from "@/lib/format/digits";
import { formatTomanFromRial } from "@/lib/format/money";
import type { ProviderCardView } from "@/lib/api/adapters/provider-card";

const coverPalettes = [
  ["#d7eee9", "#f7e1e6", "#0f766e"],
  ["#e8e1f2", "#f7e4dc", "#62508a"],
  ["#f4e3d5", "#f5dfe4", "#925c49"],
  ["#dce8ed", "#e9e1f3", "#416b7b"],
];

export function ProviderCard({ card, delayMs }: { card: ProviderCardView; delayMs?: number }) {
  const [first, second, accent] = coverPalettes[nameHash(card.name) % coverPalettes.length];

  return (
    <Link
      href={`/services/${card.id}`}
      aria-label={t("home.cardAccessibleName", { name: card.name, service: card.serviceName, category: card.categoryLabel })}
      className="block h-full rounded-2xl text-inherit no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <Card
        variant="outlined"
        sx={{
        display: "flex",
        height: "100%",
        minWidth: 0,
        overflow: "hidden",
        color: "inherit",
        textDecoration: "none",
        borderColor: "#e9ded7",
        borderRadius: "16px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 18px rgba(65, 48, 44, 0.045)",
        transition: "border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease",
        animation: delayMs === undefined ? "none" : "home-card-in 420ms both",
        animationDelay: delayMs === undefined ? undefined : `${delayMs}ms`,
        "&:hover": { borderColor: "rgba(15, 118, 110, 0.42)", boxShadow: "0 12px 30px rgba(38, 69, 64, 0.12)", transform: "translateY(-3px)" },
        "@media (prefers-reduced-motion: reduce)": { animation: "none", transition: "none" },
        }}
      >
      <Box sx={{ display: "flex", width: "100%", minWidth: 0, flexDirection: "column" }}>
        <Box sx={{ position: "relative", display: "flex", minHeight: 112, alignItems: "center", justifyContent: "space-between", overflow: "hidden", px: 2, background: `linear-gradient(125deg, ${first}, ${second})` }}>
          <Box aria-hidden="true" sx={{ position: "absolute", inset: 0, opacity: 0.18, backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%270 0 120 120%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cpath d=%27M22 110c44-21 49-66 58-100M34 80c-20-2-28-16-31-31 19 3 31 12 31 31Zm20-30c-3-21 8-35 23-46 3 21-5 38-23 46Zm1 31c16-16 34-16 52-8-14 16-32 20-52 8Z%27 fill=%27none%27 stroke=%27%230f766e%27 stroke-width=%272%27/%3E%3C/svg%3E')", backgroundPosition: "left center", backgroundRepeat: "no-repeat", backgroundSize: "150px" }} />
          <Avatar src={card.avatarUrl ?? undefined} alt={card.avatarUrl ? card.name : ""} sx={{ zIndex: 1, width: 68, height: 68, border: "3px solid rgba(255,255,255,.9)", bgcolor: accent, background: `linear-gradient(145deg, ${accent}, #172b2a)`, color: "#fff", fontFamily: "inherit", fontSize: 25, fontWeight: 800, boxShadow: "0 5px 14px rgba(23,43,42,.16)" }}>
            {card.name.slice(0, 1)}
          </Avatar>
          {card.verified && (
            <Chip
              icon={<CheckIcon />}
              label={t("badge.verified")}
              size="small"
              sx={{ zIndex: 1, height: 29, bgcolor: "rgba(255,255,255,.93)", color: "#145c55", fontFamily: "inherit", fontSize: 11, fontWeight: 750, "& .MuiChip-icon": { color: "#0f766e", ml: 0.5, mr: -0.25 } }}
            />
          )}
        </Box>
        <CardContent sx={{ display: "flex", minWidth: 0, flex: 1, flexDirection: "column", gap: 1.5, p: 2, "&:last-child": { pb: 2 } }}>
          <Box sx={{ display: "flex", minWidth: 0, alignItems: "center", justifyContent: "space-between", gap: 1 }}>
            <Typography component="h2" sx={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "inherit", fontSize: 16, fontWeight: 750, color: "#263b38" }}>
              {card.name}
            </Typography>
            {card.rating !== null && (
              <Stack direction="row" sx={{ flexShrink: 0, alignItems: "center", gap: 0.5, direction: "ltr" }} aria-label={t("rating.label", { value: numberFormatFa(card.rating) })}>
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[17px]" fill="#c87867"><path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.5 6.3-.9L12 2.8Z" /></svg>
                <Typography component="span" sx={{ fontFamily: "inherit", fontSize: 12, fontWeight: 750, color: "#5d4945" }}>{numberFormatFa(card.rating)}</Typography>
                {card.reviewCount !== null && <Typography component="span" sx={{ fontFamily: "inherit", fontSize: 11, color: "#746966" }}>({numberFormatFa(card.reviewCount)} {t("rating.reviews")})</Typography>}
              </Stack>
            )}
          </Box>
          {card.categoryLabel && <Chip size="small" label={card.categoryLabel} sx={{ alignSelf: "flex-start", maxWidth: "100%", height: 27, bgcolor: "#f2f7f5", color: "#42615c", fontFamily: "inherit", fontSize: 11, "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" } }} />}
          <Box sx={{ display: "flex", minHeight: 25, alignItems: "center", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
            {(card.city || card.neighborhood) && (
              <Typography component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, fontFamily: "inherit", fontSize: 12, color: "#5e706d" }}>
                <PinIcon />{[card.city, card.neighborhood].filter(Boolean).join("، ")}
              </Typography>
            )}
            <Typography component="span" sx={{ marginInlineStart: "auto", fontFamily: "inherit", fontSize: 12, color: "#746966" }}>
              {t("home.priceLabel")} <strong className="text-[13px] font-bold text-text">{formatTomanFromRial(card.priceIrr)}</strong>
            </Typography>
          </Box>
          <Box component="span" sx={{ display: "flex", minHeight: 42, alignItems: "center", justifyContent: "center", gap: 1, mt: "auto", borderRadius: "11px", bgcolor: "#0f766e", color: "white", fontFamily: "inherit", fontSize: 13, fontWeight: 700, transition: "background-color 150ms", "&:hover": { bgcolor: "#0d665f" } }}>
            {t("home.bookCta")}
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
          </Box>
        </CardContent>
      </Box>
      </Card>
    </Link>
  );
}

function CheckIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 10 4 4 8-8" /></svg>;
}

function PinIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
}

function nameHash(value: string) {
  return Array.from(value).reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0, 0);
}
