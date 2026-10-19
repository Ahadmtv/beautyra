# Backend gaps

Gaps between the frontend requirements and `openapi.yaml`. No endpoints are invented; each gap needs a backend decision before the matching adapter is built. Mark affected code with `TODO(backend)`.

1. **Authentication**: No login, logout, refresh, or current-user endpoint exists. `/login`, the httpOnly session cookie, and role-based routing (client, provider, admin) cannot be implemented against the contract.
2. **Public provider listing**: The home page is a grid of provider cards, but the contract only lists services (`GET /api/v1/services`). There is no public provider list or provider detail endpoint.
3. **Provider card fields**: Cards need photo, neighborhood, city, verified badge, and specialties. `ProviderProfile` has no photo, city, or neighborhood, and public service items do not include provider name or verification status.
4. **Reviews**: Cards show a star rating and review count. No reviews or ratings endpoint or field exists.
5. **Filters**: The city and neighborhood dropdowns have no matching query parameters on `GET /api/v1/services`, and there is no location or specialty taxonomy endpoint.
6. **Wallet top-up result page**: `GET /api/v1/payments/zarinpal/callback` returns 204 with no body, so the result page has no data source. Polling `GET /api/v1/payments/{paymentID}` needs the payment ID, which the callback does not supply.
7. **Image upload**: Provider photos have no upload or media endpoint.
