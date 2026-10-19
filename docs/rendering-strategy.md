# Rendering strategy

`next.config.ts` enables `cacheComponents`, so the old route segment options (`export const revalidate`, `dynamic`) are not used. Cached output is declared with `"use cache"`, `cacheLife`, and `cacheTag`, and invalidated with `updateTag` or `revalidateTag`. Per-user routes read request data (cookies), so they render per request and are never cached.

| Route | Mode | Reason |
| --- | --- | --- |
| `/` | ISR (`"use cache"` + `cacheLife` + `cacheTag("services")`) | Public provider and service listing; changes are infrequent and tolerate short staleness. |
| `/services/[id]` | ISR (`"use cache"` + `cacheLife` + `cacheTag("service:{id}")`) | Public published service detail; per-service tag allows targeted invalidation. |
| `/book/[serviceId]` | Dynamic | Shows availability for the signed-in client; slots change with bookings and time-off. |
| `/wallet` | Dynamic | User-specific balance and transactions; must never be cached. |
| `/dashboard/*` | Dynamic | User-specific bookings and data. |
| `/provider/*` | Dynamic | Provider-only data authorized by the session cookie. |
| `/admin/*` | Dynamic | Admin-only data and actions; must never be cached. |
| `/login` | Dynamic | Depends on request state (redirect targets, errors); no caching of auth pages. |
| `/api/health` | Dynamic | Liveness check should reflect the running server, not a build-time snapshot. |

Browser JavaScript never reads the JWT. Server Components, Server Actions, and Route Handlers call the backend and attach the token from an httpOnly cookie.
