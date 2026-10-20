import { z } from "zod";

export const ROLES = ["client", "provider", "admin"] as const;
export type Role = (typeof ROLES)[number];

export type Session = {
  userId: string;
  role: Role;
  roles: readonly Role[];
  email?: string;
  expiresAt: number;
};

// The backend signs access tokens with these claims. The frontend only decodes the
// payload for routing; the backend verifies the signature and expiry on every call.
const claimsSchema = z
  .object({
    user_id: z.number().int().positive().optional(),
    sub: z.string().min(1).optional(),
    email: z.string().min(1).optional(),
    roles: z.array(z.enum(ROLES)).min(1),
    exp: z.number(),
  })
  .refine((claims) => claims.user_id !== undefined || claims.sub !== undefined, {
    message: "missing subject",
  });

function primaryRole(roles: readonly Role[]): Role {
  if (roles.includes("admin")) return "admin";
  if (roles.includes("provider")) return "provider";
  return "client";
}

export function sessionFromClaims(payload: unknown, nowSeconds: number): Session | null {
  const parsed = claimsSchema.safeParse(payload);
  if (!parsed.success || parsed.data.exp <= nowSeconds) {
    return null;
  }
  const { user_id, sub, email, roles, exp } = parsed.data;
  return {
    userId: String(user_id ?? sub),
    role: primaryRole(roles),
    roles,
    email,
    expiresAt: exp,
  };
}
