import { z } from "zod";

import { type MessageKey, t } from "../../config/messages.fa";

const problemFieldSchema = z.object({
  field: z.string(),
  code: z.string(),
  message: z.string(),
});

const problemSchema = z.object({
  type: z.string(),
  title: z.string(),
  status: z.number().int(),
  code: z.string(),
  request_id: z.string(),
  field_errors: z.array(problemFieldSchema).optional(),
});

export type ProblemFieldError = z.infer<typeof problemFieldSchema>;

type ApiErrorInit = {
  status: number;
  code: string;
  title: string;
  requestId: string;
  fieldErrors?: ProblemFieldError[];
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly requestId: string;
  readonly fieldErrors: readonly ProblemFieldError[];

  constructor(init: ApiErrorInit) {
    super(init.title);
    this.name = "ApiError";
    this.status = init.status;
    this.code = init.code;
    this.requestId = init.requestId;
    this.fieldErrors = init.fieldErrors ?? [];
  }
}

export async function parseProblem(response: Response): Promise<ApiError> {
  const fallback = new ApiError({
    status: response.status,
    code: "unknown_error",
    title: response.statusText,
    requestId: "",
  });

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/problem+json")) {
    return fallback;
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    return fallback;
  }

  const parsed = problemSchema.safeParse(json);
  if (!parsed.success) {
    return fallback;
  }

  return new ApiError({
    status: response.status,
    code: parsed.data.code,
    title: parsed.data.title,
    requestId: parsed.data.request_id,
    fieldErrors: parsed.data.field_errors,
  });
}

export function toFieldErrors(error: ApiError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const item of error.fieldErrors) {
    if (!Object.hasOwn(result, item.field)) {
      result[item.field] = item.code === "required" ? t("validation.required") : t("api.field.invalid");
    }
  }
  return result;
}

const statusMessageKeys: Partial<Record<number, MessageKey>> = {
  400: "api.error.badRequest",
  401: "api.error.unauthorized",
  403: "api.error.forbidden",
  404: "api.error.notFound",
  409: "api.error.conflict",
  503: "api.error.unavailable",
};

export function problemMessage(error: ApiError): string {
  return t(statusMessageKeys[error.status] ?? "api.error.generic");
}
