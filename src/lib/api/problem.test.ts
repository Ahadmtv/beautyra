import { describe, expect, it } from "vitest";

import { messages } from "../../config/messages.fa";
import { ApiError, parseProblem, problemMessage, toFieldErrors } from "./problem";

function problemResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/problem+json" },
  });
}

describe("parseProblem", () => {
  it("maps a problem+json body to ApiError with field errors", async () => {
    const error = await parseProblem(
      problemResponse(
        {
          type: "about:blank",
          title: "Invalid input",
          status: 400,
          code: "invalid_request",
          request_id: "req-1",
          field_errors: [{ field: "name", code: "required", message: "required" }],
        },
        400,
      ),
    );

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(400);
    expect(error.code).toBe("invalid_request");
    expect(error.requestId).toBe("req-1");
    expect(error.fieldErrors).toEqual([{ field: "name", code: "required", message: "required" }]);
  });

  it("falls back to a generic error when the body is not problem+json", async () => {
    const response = new Response("<html>bad gateway</html>", {
      status: 502,
      headers: { "content-type": "text/html" },
    });

    const error = await parseProblem(response);

    expect(error.status).toBe(502);
    expect(error.code).toBe("unknown_error");
  });

  it("falls back to a generic error when the problem body is malformed", async () => {
    const error = await parseProblem(problemResponse({ title: "missing fields" }, 409));

    expect(error.status).toBe(409);
    expect(error.code).toBe("unknown_error");
  });
});

describe("toFieldErrors", () => {
  it("keeps the first error per field and maps codes to Persian messages", () => {
    const error = new ApiError({
      status: 400,
      code: "invalid_request",
      title: "Invalid input",
      requestId: "req-2",
      fieldErrors: [
        { field: "name", code: "required", message: "required" },
        { field: "name", code: "too_long", message: "too long" },
        { field: "price_irr", code: "min", message: "min" },
      ],
    });

    expect(toFieldErrors(error)).toEqual({
      name: messages["validation.required"],
      price_irr: messages["api.field.invalid"],
    });
  });
});

describe("problemMessage", () => {
  it("returns the Persian message for a mapped status", () => {
    const error = new ApiError({ status: 409, code: "x", title: "x", requestId: "" });

    expect(problemMessage(error)).toBe(messages["api.error.conflict"]);
  });

  it("returns the generic message for an unmapped status", () => {
    const error = new ApiError({ status: 418, code: "x", title: "x", requestId: "" });

    expect(problemMessage(error)).toBe(messages["api.error.generic"]);
  });
});
