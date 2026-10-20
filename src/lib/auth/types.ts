import type { Session } from "./claims";

export type LoginInput =
  | {
      email: string;
      password: string;
    }
  | {
      phone: string;
      code: string;
    };

export type SessionTokens = {
  token: string;
  refreshToken?: string;
  expiresAt: number;
};

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid credentials");
    this.name = "InvalidCredentialsError";
  }
}

export interface AuthProvider {
  login(input: LoginInput): Promise<SessionTokens>;
  refresh(refreshToken: string): Promise<SessionTokens | null>;
  getSession(token: string): Promise<Session | null>;
  logout(refreshToken?: string): Promise<void>;
}
