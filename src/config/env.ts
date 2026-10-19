import { z } from "zod";

const envSchema = z.object({
  API_BASE_URL: z.url(),
  SITE_URL: z.url(),
  SESSION_COOKIE_NAME: z.string().min(1),
  USE_MOCK_META: z.enum(["true", "false"]).transform((value) => value === "true"),
  AUTH_PROVIDER: z.enum(["mock", "real"]).default("mock"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment configuration:\n${z.prettifyError(parsed.error)}`);
}

export const env = parsed.data;
