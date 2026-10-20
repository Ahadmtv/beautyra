import { describe, expect, it } from "vitest";

import { ApiError } from "@/lib/api/problem";

import { loginErrorState } from "./login-errors";
import { parseRegisterForm, registerErrorState } from "./register";
import { InvalidCredentialsError } from "./types";

function formData(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

describe("parseRegisterForm", () => {
  it("accepts email and password without a phone", () => {
    const result = parseRegisterForm(formData({ email: " user@example.com ", password: "secret1234" }));
    expect(result).toEqual({
      input: { email: "user@example.com", password: "secret1234" },
    });
  });

  it("normalizes Persian digits and includes an optional phone", () => {
    const result = parseRegisterForm(
      formData({ email: "user@example.com", phone: "۰۹۱۲۳۴۵۶۷۸۹", password: "secret1234" }),
    );
    expect(result).toEqual({
      input: { email: "user@example.com", phone: "09123456789", password: "secret1234" },
    });
  });

  it("rejects an invalid email", () => {
    const result = parseRegisterForm(formData({ email: "not-an-email", password: "secret1234" }));
    expect(result).toHaveProperty("errors.email");
  });

  it("rejects a password shorter than eight characters", () => {
    const result = parseRegisterForm(formData({ email: "user@example.com", password: "short" }));
    expect(result).toHaveProperty("errors.password");
  });
});

describe("registerErrorState", () => {
  it("maps duplicate or invalid register credentials to a safe generic message", () => {
    const state = registerErrorState(
      new ApiError({ status: 401, code: "invalid_credentials", title: "x", requestId: "" }),
    );
    expect(state.errors?.form).toContain("ثبت شده باشد");
  });

  it("maps field errors returned by the API", () => {
    const state = registerErrorState(
      new ApiError({
        status: 400,
        code: "invalid_request",
        title: "x",
        requestId: "",
        fieldErrors: [{ field: "email", code: "invalid", message: "x" }],
      }),
    );
    expect(state.errors?.email).toBeDefined();
  });

  it("maps rate limiting and unavailable services", () => {
    expect(
      registerErrorState(new ApiError({ status: 429, code: "rate_limited", title: "x", requestId: "" }))
        .errors?.form,
    ).toContain("بیش از حد مجاز");
    expect(
      registerErrorState(
        new ApiError({ status: 503, code: "upstream_unreachable", title: "x", requestId: "" }),
      ).errors?.form,
    ).toContain("در دسترس نیست");
  });
});

describe("loginErrorState", () => {
  it("maps invalid credentials", () => {
    expect(loginErrorState(new InvalidCredentialsError()).errors.form).toBeDefined();
  });

  it("maps rate limiting and network failures instead of throwing", () => {
    expect(
      loginErrorState(new ApiError({ status: 429, code: "rate_limited", title: "x", requestId: "" }))
        .errors.form,
    ).toContain("بیش از حد مجاز");
    expect(
      loginErrorState(
        new ApiError({ status: 503, code: "upstream_unreachable", title: "x", requestId: "" }),
      ).errors.form,
    ).toContain("در دسترس نیست");
  });

  it("maps unexpected failures to a generic message", () => {
    expect(loginErrorState(new Error("boom")).errors.form).toContain("دوباره تلاش");
  });
});
