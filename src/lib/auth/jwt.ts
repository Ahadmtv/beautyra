const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64UrlEncode(text: string): string {
  let binary = "";
  for (const byte of encoder.encode(text)) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(segment: string): string {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  return decoder.decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
}

export function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

// The signature is not verified here because the backend verifies the token on every API call.
// The payload is only used for routing and UI decisions.
export function decodeJwtPayload(token: string): unknown {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }
  try {
    return JSON.parse(base64UrlDecode(parts[1]));
  } catch {
    return null;
  }
}

export function createUnsignedJwt(payload: Record<string, unknown>): string {
  const header = base64UrlEncode(JSON.stringify({ alg: "none", typ: "JWT" }));
  return `${header}.${base64UrlEncode(JSON.stringify(payload))}.`;
}
