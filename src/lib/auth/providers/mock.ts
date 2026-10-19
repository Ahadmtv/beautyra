import { sessionFromClaims, type Role } from "../claims";
import { createUnsignedJwt, decodeJwtPayload, nowSeconds } from "../jwt";
import { InvalidCredentialsError, type AuthProvider } from "../types";

const MOCK_SESSION_TTL_SECONDS = 24 * 60 * 60;
const MOCK_CODE = "123456";

// TODO(backend): remove once a login endpoint exists (docs/backend-gaps.md, item 1).
const MOCK_USERS: readonly { phone: string; userId: string; role: Role }[] = [
  { phone: "09120000001", userId: "mock-client-1", role: "client" },
  { phone: "09120000002", userId: "mock-provider-1", role: "provider" },
  { phone: "09120000003", userId: "mock-admin-1", role: "admin" },
];

export const mockAuthProvider: AuthProvider = {
  async login({ phone, code }) {
    const user = MOCK_USERS.find((candidate) => candidate.phone === phone);
    if (!user || code !== MOCK_CODE) {
      throw new InvalidCredentialsError();
    }

    const issuedAt = nowSeconds();
    const expiresAt = issuedAt + MOCK_SESSION_TTL_SECONDS;
    const token = createUnsignedJwt({
      sub: user.userId,
      role: user.role,
      iat: issuedAt,
      exp: expiresAt,
    });
    return { token, expiresAt };
  },

  async getSession(token) {
    return sessionFromClaims(decodeJwtPayload(token), nowSeconds());
  },

  async logout() {},
};
