import { z } from "zod";

const envSchema = z.object({
  API_BASE_URL: z.url(),
  SITE_URL: z.url(),
  SESSION_COOKIE_NAME: z.string().min(1),
  AUTH_PROVIDER: z.enum(["mock", "real"]).default("real"),
  PAYMENT_RETURN_FORWARD_TO_BACKEND: z.enum(["true", "false"]).default("false").transform((value) => value === "true"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment configuration:\n${z.prettifyError(parsed.error)}`);
}

export const env = parsed.data;

export const SESSION_REFRESH_COOKIE_NAME = `${env.SESSION_COOKIE_NAME}_refresh`;
