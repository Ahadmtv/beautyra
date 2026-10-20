import { sessionFromClaims, type Role } from "../claims";
import { createUnsignedJwt, decodeJwtPayload, nowSeconds } from "../jwt";
import { InvalidCredentialsError, type AuthProvider } from "../types";

const MOCK_SESSION_TTL_SECONDS = 24 * 60 * 60;
const MOCK_CODE = "123456";

// UI-only development adapter. These unsigned tokens are rejected by the real
// backend, so use AUTH_PROVIDER=real for anything beyond unauthenticated screens.
const MOCK_USERS: readonly { phone: string; userId: number; email: string; role: Role }[] = [
  { phone: "09120000001", userId: 1, email: "client@mock.local", role: "client" },
  { phone: "09120000002", userId: 2, email: "provider@mock.local", role: "provider" },
  { phone: "09120000003", userId: 3, email: "admin@mock.local", role: "admin" },
];

export const mockAuthProvider: AuthProvider = {
  async login(input) {
    if (!("phone" in input)) {
      throw new InvalidCredentialsError();
    }
    const user = MOCK_USERS.find((candidate) => candidate.phone === input.phone);
    if (!user || input.code !== MOCK_CODE) {
      throw new InvalidCredentialsError();
    }

    const issuedAt = nowSeconds();
    const expiresAt = issuedAt + MOCK_SESSION_TTL_SECONDS;
    const token = createUnsignedJwt({
      sub: String(user.userId),
      user_id: user.userId,
      email: user.email,
      roles: [user.role],
      iat: issuedAt,
      exp: expiresAt,
    });
    return { token, expiresAt };
  },

  async refresh() {
    return null;
  },

  async getSession(token) {
    return sessionFromClaims(decodeJwtPayload(token), nowSeconds());
  },

  async logout() {},
};
