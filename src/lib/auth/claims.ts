import { z } from "zod";

export const ROLES = ["client", "provider", "admin"] as const;
export type Role = (typeof ROLES)[number];

export type Session = {
  userId: string;
  role: Role;
  expiresAt: number;
};

// ASSUMPTION: the JWT payload carries `sub` (user ID), `role` (one of ROLES), and `exp` (NumericDate, seconds).
// The openapi contract does not define these claims. This is the only file that knows their names.
const claimsSchema = z.object({
  sub: z.string().min(1),
  role: z.enum(ROLES),
  exp: z.number(),
});

export function sessionFromClaims(payload: unknown, nowSeconds: number): Session | null {
  const parsed = claimsSchema.safeParse(payload);
  if (!parsed.success || parsed.data.exp <= nowSeconds) {
    return null;
  }
  return {
    userId: parsed.data.sub,
    role: parsed.data.role,
    expiresAt: parsed.data.exp,
  };
}
