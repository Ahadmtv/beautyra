import type { AuthProvider } from "../types";

class NotImplementedError extends Error {
  constructor(method: string) {
    super(
      `Real auth provider "${method}" is not implemented. TODO(backend): connect to the backend auth endpoint (docs/backend-gaps.md, item 1).`,
    );
    this.name = "NotImplementedError";
  }
}

export const realAuthProvider: AuthProvider = {
  async login() {
    throw new NotImplementedError("login");
  },
  async getSession() {
    throw new NotImplementedError("getSession");
  },
  async logout() {
    throw new NotImplementedError("logout");
  },
};
