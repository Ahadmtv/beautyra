import { env } from "@/config/env";

import { mockAuthProvider } from "./providers/mock";
import { realAuthProvider } from "./providers/real";
import type { AuthProvider } from "./types";

export function getAuthProvider(): AuthProvider {
  if (env.AUTH_PROVIDER === "real") {
    return realAuthProvider;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_PROVIDER=mock is not allowed in production.");
  }
  return mockAuthProvider;
}
