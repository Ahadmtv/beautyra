# Rendering strategy

`next.config.ts` enables `cacheComponents`, so the old route segment options (`export const revalidate`, `dynamic`) are not used. Cached output is declared with `"use cache"`, `cacheLife`, and `cacheTag`, and invalidated with `updateTag` or `revalidateTag`. Per-user routes read request data (cookies), so they render per request and are never cached.

| Route | Mode | Reason |
| --- | --- | --- |
| `/` | Shell prerendered; listing data cached (`"use cache"` + `cacheLife({ revalidate: 300 })` + `cacheTag("services")`) | Public provider and service listing; changes are infrequent and tolerate short staleness. |
| `/services/[id]` | ISR (`"use cache"` + `cacheLife({ revalidate: 600 })` + `cacheTag("service-{id}")`) | Public published service detail; per-service tag allows targeted invalidation. |
| `/book/[serviceId]` | Dynamic | Shows availability for the signed-in client; slots change with bookings and time-off. |
| `/wallet` | Dynamic | User-specific balance and transactions; must never be cached. |
| `/dashboard/*` | Dynamic | User-specific bookings and data. |
| `/provider/*` | Dynamic | Provider-only data authorized by the session cookie. |
| `/admin/*` | Dynamic | Admin-only data and actions; must never be cached. |
| `/login` | Dynamic | Depends on request state (redirect targets, errors); no caching of auth pages. |
| `/api/health` | Dynamic | Liveness check should reflect the running server, not a build-time snapshot. |
| `/dev/ui` | Static, returns 404 in production | Development-only component showcase; `notFound()` is called when `NODE_ENV` is `production`. |

## Home page (`/`) with filters

Filters (`city`, `neighborhood`, `specialty`, `q`) and the pagination cursor are URL search params, so every filtered or paged URL is shareable and rendered on the server.

- The backend call lives in `getPublicServiceCards(cursor, limit)` (`src/lib/api/services.ts`). It is a `"use cache"` function with a 300-second revalidation and the `services` tag. The cache key is the `(cursor, limit)` pair, so the unfiltered first page and every filtered URL share one cached backend response.
- Filtering runs in memory on that cached page (`src/lib/listing/filters.ts`). It does not change the backend request, so filtered URLs never bypass the cache.
- `src/app/page.tsx` reads `searchParams` inside a `Suspense` boundary. The header, filter bar, specialty navigation, and skeleton are the prerendered App Shell. The listing streams in after the params are resolved.
- Because the page reads `searchParams`, Next.js does not store the full HTML of the unfiltered home page as an ISR entry. Only the shell and the cached data are reused. Changing this to a fully static unfiltered page would need a separate route or a different filter mechanism. This has not been verified with `next build` in this environment.
- The backend has no filter parameters, so filtering applies only to the fetched page. A page can show fewer cards than `limit`, or none, while `next_cursor` still points to more results. The "load more" link stays visible in that case (`docs/backend-gaps.md`, item 4).

## Service detail (`/services/[id]`)

- `getPublicServiceDetail(id)` (`src/lib/api/services.ts`) is a `"use cache"` function with a 600-second revalidation and the `service-{id}` tag. It returns the service and its mock provider metadata, so the provider lookup is cached together with the service.
- `generateStaticParams` prerenders the first 50 cards from `getPublicServiceCards(undefined, 50)`, which shares the home page's cached response. Other IDs render on first request and are cached (`dynamicParams` defaults to `true`).
- An invalid ID or a backend 404 calls `notFound()`. Other API errors reach `src/app/error.tsx`.
- The page reads no request data, so the HTML is cached by the same lifetime as its data.
- Canonical URL, Persian title and description, and OpenGraph come from `generateMetadata`. The JSON-LD uses the `Service` type, with `Physician` as provider only when the provider name is known. A `Physician` page would need a provider detail route, which does not exist yet.

Browser JavaScript never reads the JWT. Server Components, Server Actions, and Route Handlers call the backend and attach the token from an httpOnly cookie.
