import { t } from "@/config/messages.fa";
import { MuiLinkButton } from "./MuiLinkButton";

export function LoadMoreLink({ href }: { href: string }) {
  return (
    <MuiLinkButton
      href={href}
      scroll={false}
      variant="outlined"
      sx={{ alignSelf: { sm: "flex-start" }, minHeight: 42, px: 2.5, borderRadius: 2, borderColor: "#dce7e4", color: "#0f766e", fontFamily: "inherit", fontWeight: 700, textTransform: "none", "&:hover": { borderColor: "#0f766e", bgcolor: "#e6f4f1" } }}
    >
      {t("common.loadMore")}
    </MuiLinkButton>
  );
}
