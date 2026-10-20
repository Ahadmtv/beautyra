import { connection } from "next/server";
import { t } from "@/config/messages.fa";
import { MuiLinkButton } from "@/components/ui/MuiLinkButton";
import { getSession } from "@/lib/auth/session";
import { AccountMenu } from "./AccountMenu";

export function LoginLink() {
  return (
    <MuiLinkButton
      href="/login"
      variant="outlined"
      sx={{ minHeight: 40, px: 2, borderRadius: 999, borderColor: "#dce7e4", color: "#0f766e", fontFamily: "inherit", fontSize: 14, fontWeight: 700, textTransform: "none", "&:hover": { borderColor: "#0f766e", bgcolor: "#e6f4f1" } }}
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
