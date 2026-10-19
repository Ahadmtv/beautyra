import type { Session } from "./claims";

export type LoginInput = {
  phone: string;
  code: string;
};

export type LoginResult = {
  token: string;
  expiresAt: number;
};

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid phone or code");
    this.name = "InvalidCredentialsError";
  }
}

export interface AuthProvider {
  login(input: LoginInput): Promise<LoginResult>;
  getSession(token: string): Promise<Session | null>;
  logout(token: string): Promise<void>;
}
