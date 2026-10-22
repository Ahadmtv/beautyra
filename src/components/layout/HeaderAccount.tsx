import { connection } from "next/server";
import { t } from "@/config/messages.fa";
import { MuiLinkButton } from "@/components/ui/MuiLinkButton";
import { getSession } from "@/lib/auth/session";
import { AccountMenu } from "./AccountMenu";

export function LoginLink() {
  return (
    <MuiLinkButton
      href="/login"
      variant="contained"
      sx={{ minHeight: 42, px: 2.5, borderRadius: 999, bgcolor: "#0f766e", color: "#ffffff", boxShadow: "0 6px 16px rgba(15,118,110,.22)", fontFamily: "inherit", fontSize: 14, fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#0b5f58", boxShadow: "0 8px 20px rgba(15,118,110,.3)" } }}
    >
      {t("header.login")}
    </MuiLinkButton>
  );
}

export async function HeaderAccount() {
  await connection();

  const session = await getSession();
  if (!session) {
    return <LoginLink />;
  }

  return <AccountMenu role={session.role} />;
}
