# Rendering strategy

`next.config.ts` enables `cacheComponents`, so the old route segment options (`export const revalidate`, `dynamic`) are not used. Cached output is declared with `"use cache"`, `cacheLife`, and `cacheTag`, and invalidated with `updateTag` or `revalidateTag`. Per-user routes read request data (cookies), so they render per request and are never cached.

| Route | Mode | Reason |
| --- | --- | --- |
| `/` | Shell prerendered; listing data cached (`"use cache"` + `cacheLife({ revalidate: 300 })` + `cacheTag("services")`) | Public provider and service listing; changes are infrequent and tolerate short staleness. |
| `/services/[id]` | ISR (`"use cache"` + `cacheLife({ revalidate: 600 })` + `cacheTag("service-{id}")`) | Public published service detail; per-service tag allows targeted invalidation. |
| `/book/[serviceId]` | Dynamic | Shows availability for the signed-in client; slots change with bookings and time-off. |
| `/wallet` | Dynamic | User-specific balance and transactions; must never be cached. |
| `/wallet/charge` | Dynamic | Client-only top-up page that preserves a validated return path. |
| `/wallet/payment/result` | Dynamic | Reads the payment cookies and verifies status through the backend. |
| `/dashboard/*` | Dynamic | User-specific bookings and data. |
| `/provider/*` | Dynamic | Provider-only data authorized by the session cookie. |
| `/admin/*` | Dynamic | Admin-only data and actions; must never be cached. |
| `/login` | Dynamic | Depends on request state (redirect targets, errors); no caching of auth pages. |
| `/register` | Dynamic | Reads `next`, checks the current session, and never caches an authentication form. |
| `/account` | Dynamic | Reads the session and the current user from `GET /api/v1/me`; never cached. |
| `/forbidden` | Static | Shows the role-authorization error page. |
| `/auth/refresh` | Dynamic | Reads the httpOnly refresh cookie and rotates it; must never be cached. |
| `/auth/expired` | Dynamic | Clears session cookies and redirects with the requested `next` path. |
| `/api/health` | Dynamic | Liveness check should reflect the running server, not a build-time snapshot. |
| `/dev/ui` | Static, returns 404 in production | Development-only component showcase; `notFound()` is called when `NODE_ENV` is `production`. |

## Home page (`/`) with filters

Filters (`category` and `q`) and the pagination cursor are URL search params, so every filtered or paged URL is shareable and rendered on the server.

- The backend call lives in `getPublicServiceCards(cursor, limit, category)` (`src/lib/api/services.ts`). It is a `"use cache"` function with a 300-second revalidation and the `services` tag. The cache key includes the cursor, limit, and category, so each beauty category has its own cached backend page.
- Category filtering runs in PostgreSQL through `GET /api/v1/services?category=`. Free-text filtering still runs in memory on the cached page (`src/lib/listing/filters.ts`).
- `src/app/page.tsx` reads `searchParams` inside a `Suspense` boundary. The header, filter bar, category navigation, and skeleton are the prerendered App Shell. The listing streams in after the params are resolved.
- Because the page reads `searchParams`, Next.js does not store the full HTML of the unfiltered home page as an ISR entry. Only the shell and the cached data are reused.
- The remaining filters apply only to the fetched page. A page can show fewer cards than `limit`, or none, while `next_cursor` still points to more results. The "load more" link stays visible in that case (`docs/backend-gaps.md`, item 4).

## Service detail (`/services/[id]`)

- `getPublicServiceDetail(id)` (`src/lib/api/services.ts`) is a `"use cache"` function with a 600-second revalidation and the `service-{id}` tag. It returns the service and its mock provider metadata, so the provider lookup is cached together with the service.
- `generateStaticParams` prerenders the first 50 cards from `getPublicServiceCards(undefined, 50)`, which shares the home page's cached response. Other IDs render on first request and are cached (`dynamicParams` defaults to `true`).
- An invalid ID or a backend 404 calls `notFound()`. Other API errors reach `src/app/error.tsx`.
- The page reads no request data, so the HTML is cached by the same lifetime as its data.
- Canonical URL, Persian title and description, and OpenGraph come from `generateMetadata`. The JSON-LD uses the `Service` type, with `BeautySalon` as provider when the mock provider name is known. A provider detail page would need a public provider route, which does not exist yet.

Browser JavaScript never reads the JWT. Server Components, Server Actions, and Route Handlers call the backend and attach the access token from an httpOnly cookie. The refresh token lives in a separate httpOnly cookie and is used only by `/auth/refresh` and the logout action.
