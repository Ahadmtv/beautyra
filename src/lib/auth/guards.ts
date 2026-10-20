import type { Role, Session } from "./claims";

export function isRoleAllowed(session: Session | null, allowed: readonly Role[]): boolean {
  return session !== null && session.roles.some((role) => allowed.includes(role));
}
