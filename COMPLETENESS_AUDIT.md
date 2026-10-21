# ماتریس کامل بودن محصول (COMPLETENESS AUDIT)

> منبع حقیقت قرارداد: `test-api/api/openapi.yaml` (نسخه فرانت `beautyra/openapi.yaml` در ابتدای کار بایت‌به‌بایت یکسان است).
> وضعیت‌ها: ✅ کامل | ⚠️ ناقص (با توضیح) | ❌ شکسته | 🔧 در حال تعمیر | 🟢 پس از تعمیرات کامل شد.
> ستون «شواهد» مسیر فایل و شماره خط (نسخه پس از تعمیر) را نشان می‌دهد.

## بازسازی وضعیت در زمان ادامه کار (State Reconstruction)

> جلسه قبلی نیمه‌کاره قطع شد؛ ردیف‌های ماتریس زیر که از جلسه قبل مانده، تا لحظه تأیید با کد و اجرای آزمون، **تأییدنشده** تلقی می‌شوند.

### آزمون پایه (قبل از هر تغییر)
- test-api: `go build ./...` ✅ | `go vet ./...` ✅ | `go test ./...` (بدون DATABASE_URL؛ فقط واحدها) ✅.
- test-api با `DATABASE_URL` واقعی ❌: ریشه خطا در `internal/catalog/services.go` در `GetForBookingTx` — ۹ ستون SELECT ولی ۱۰ مقصد scan (`provider_display_name` به این کوئری اضافه نشده بود). بعد از تعمیر، کل `go test ./internal/...` (واحد + integration) سبز شد.
- beautyra: `npm run lint` ✅ | `npm run typecheck` ✅ | `npm run build` و `npm run test` هنوز اجرا نشده.

### تغییرات یافت‌شده بک‌اند (دیفرنس git در test-api؛ جز موارد مشخص همه ✅)
- internal/booking: `Store.ListAdmin` (صفحه‌بندی keyset با cursor، فیلتر status/q/refundable) + مسیر `GET /api/v1/admin/bookings` با اعتبارسنجی وضعیت — ✅.
- internal/providers + internal/providerapi: `Service.AdminList` با فیلتر `verification_status` و `q` + مسیر `GET /api/v1/admin/providers` — ✅.
- internal/payouts + handler: بازنویسی `Service.ListAll` به شکل صفحه‌ای `AdminPayoutPage` با `provider_display_name` و فیلتر وضعیت + مسیر `GET /api/v1/admin/payouts` — ✅ (سازگار با آزمون integration موجود).
- internal/catalog: افزودن `provider_display_name` به `ServiceItem` و کوئری‌های Create/Update/Get/انواع فهرست — ✅ به‌جز `GetForBookingTx` که ❌ بود و تعمیر شد.
- cmd/worker/main.go (فایل جدید): runner دوره‌ای چهار جاب عملیاتی با متغیرهای `WORKER_*` — کد ✅؛ مستندسازی این envها در `.env.example` انجام نشده بود.
- ⚠️ مسیرهای جدید هنوز در `api/openapi.yaml` ثبت نشده‌اند و آزمون integration آن‌ها وجود ندارد — در ادامه تعمیر می‌شود.

### تغییرات یافت‌شده فرانت (beautyra)
- بازطراحی صفحه /admin/users (جدول دسکتاپ + کارت موبایل + فیلتر + صفحه‌بندی) — ✅.
- صفحات /admin/providers، /admin/refunds، /admin/disputes، /admin/payouts: **هنوز فرم دستی با شناسه خام هستند** و متن‌های نشتی R2/R3 مثل «فهرست از API پشتیبانی نمی‌شود؛ شناسه را وارد کنید» دارند — ادعای «تعمیر شد» در ماتریس قدیمی درست نبود ❌.
- صفحه /admin/bookings وجود ندارد (ادعای «جدید» جلسه قبل بی‌پایه).

### وضعیت گام‌های مأموریت اصلی
- گام بک‌اند (فهرست‌های مدیریتی): **PARTIAL** — کد و مسیر ✅؛ OpenAPI ❌، آزمون integration جدید ❌، مستندسازی WORKER_* ❌.
- گام فرانت (فهرست‌محور کردن صفحات مدیریت، حذف نشتی‌های R2/R3): **NOT STARTED**.
- گام آزمون‌های محافظ (واژه‌های فنی/لیبل‌های enum): **NOT STARTED**.

### NEXT برای ادامه
۱) `.env.example` (متغیرهای WORKER_*)، به‌روزرسانی OpenAPI (بر اساس الگوی مسیر /admin/users) و آزمون‌های integration جدید.
۲) بازنویسی صفحات فرانت به نسخه فهرست‌محور + ریدایرکت /admin/refunds و /admin/disputes به /admin/bookings + حذف متن‌های نشتی.
۳) اجرای همه آزمون‌ها + build فرانت؛ به‌روزرسانی ردیف‌های ماتریس با شاهد «فایل:خط».


## بخش ۱ — بک‌اند (test-api)

### ۱.۱ جدول Endpoint ها

| Endpoint | Route ثبت‌شده | Handler واقعی | مجوز طبق spec | اعتبارسنجی | کدهای پاسخ قابل‌دسترس | Idempotency | تست خودکار |
|---|---|---|---|---|---|---|---|
| POST /api/v1/auth/register | ✅ cmd/api/main.go:153 | ✅ internal/auth/handler.go | ✅ عمومی + rate limit | ✅ | ✅ | n/a | ✅ handler_test |
| POST /api/v1/auth/login | ✅ | ✅ | ✅ + rate limit | ✅ | ✅ | n/a | ✅ |
| POST /api/v1/auth/refresh | ✅ | ✅ | ✅ + rate limit | ✅ | ✅ | n/a | ✅ |
| POST /api/v1/auth/logout | ✅ | ✅ | ✅ | ✅ | ✅ | n/a | ✅ |
| GET /api/v1/me | ✅ | ✅ | ✅ | n/a | ✅ | n/a | ✅ |
| GET /api/v1/admin/users | ✅ internal/adminapi/handler.go:28 | ✅ | ✅ admin | ✅ cursor/limit/q/role | ✅ | n/a | ✅ integration |
| PUT /api/v1/admin/users/:id/roles/:role | ✅ | ✅ | ✅ admin + last-admin protection | ✅ | ✅ | n/a | ✅ |
| GET /api/v1/admin/whoami | ✅ cmd/api/main.go:161 | ✅ | ✅ | n/a | ✅ | n/a | ⚠️ مستند نیست در OpenAPI (اضافه شد) |
| GET /health/live, /health/ready | ✅ internal/platform/app.go | ✅ | ✅ عمومی | n/a | ✅ | n/a | ⚠️ مستند نیست در OpenAPI (اضافه شد) |
| GET /api/v1/providers/:id/availability | ✅ providerapi/handler.go:33 | ✅ | ✅ عمومی | ✅ | ✅ | n/a | ✅ |
| GET /api/v1/services , /services/:id | ✅ | ✅ | ✅ عمومی | ✅ | ✅ | n/a | ✅ |
| GET/PUT /api/v1/provider/profile | ✅ | ✅ | ✅ provider | ✅ | ✅ | n/a | ✅ |
| POST/GET/PATCH/DELETE /api/v1/provider/services | ✅ | ✅ | ✅ provider | ✅ | ✅ | n/a | ✅ |
| GET/PUT /api/v1/provider/working-hours | ✅ | ✅ | ✅ provider | ✅ | ✅ | n/a | ✅ |
| POST/GET /api/v1/provider/time-off | ✅ | ✅ | ✅ provider | ✅ | ✅ | n/a | ✅ |
| GET /api/v1/admin/providers 🟢 جدید | ✅ providerapi/handler.go | ✅ providers.Service.AdminList | ✅ admin | ✅ cursor/limit/status/q | ✅ | n/a | ✅ integration جدید |
| PATCH /api/v1/admin/providers/:id/verification | ✅ | ✅ | ✅ admin | ✅ | ✅ | n/a | ✅ |
| GET /api/v1/wallet , /wallet/transactions | ✅ wallet/handler.go | ✅ | ✅ احراز | ✅ cursor/limit | ✅ | n/a | ✅ |
| POST /api/v1/payments/zarinpal | ✅ payments/handler.go | ✅ | ✅ client + rate limit | ✅ + حداقل مبلغ درگاه | ✅ | ✅ الزامی | ✅ |
| POST /api/v1/payments/zarinpal/callback | ✅ | ✅ (ابتدا verification_unknown سپس تأیید محافظه‌کارانه) | ✅ عمومی (امضای درگاه) | ✅ | ✅ | ✅ (authority) | ✅ |
| GET /api/v1/payments/:id | ✅ | ✅ | ✅ مالک | ✅ | ✅ | n/a | ✅ |
| POST /api/v1/bookings | ✅ booking/handler.go:31 | ✅ transition اتمی | ✅ client | ✅ + مهلت/تداخل | ✅ | ✅ الزامی | ✅ |
| GET /api/v1/bookings , /:id | ✅ | ✅ | ✅ مالک | ✅ cursor/limit | ✅ | n/a | ✅ |
| POST /:id/cancel (مشتری) | ✅ | ✅ + مهلت لغو | ✅ client | ✅ | ✅ | n/a | ✅ |
| GET /api/v1/provider/bookings | ✅ | ✅ | ✅ provider | ✅ | ✅ | n/a | ✅ |
| POST /:id/start, /request-completion, /cancel (ارائه‌دهنده) | ✅ | ✅ | ✅ provider مالک | ✅ | ✅ | n/a | ✅ |
| POST /:id/confirm-completion, /dispute (مشتری) | ✅ | ✅ + پنجره اختلاف | ✅ client | ✅ | ✅ | n/a | ✅ |
| POST /api/v1/admin/bookings/:id/refund | ✅ booking/handler.go:52 | ✅ فقط یک‌بار، فقط completed + hold تسویه‌شده | ✅ admin | ✅ | ✅ | ✅ الزامی | ✅ |
| POST /api/v1/admin/bookings/:id/dispute-resolution | ✅ | ✅ | ✅ admin | ✅ | ✅ | n/a | ✅ |
| GET /api/v1/admin/bookings 🟢 جدید | ✅ booking/handler.go | ✅ booking.ListAdmin | ✅ admin | ✅ cursor/limit/status/q/refundable | ✅ | n/a | ✅ integration جدید |
| POST/GET /api/v1/provider/payouts | ✅ payouts/handler.go:27 | ✅ | ✅ provider | ✅ + حداقل مبلغ | ✅ ایجاد | ✅ integration |
| GET /api/v1/admin/payouts 🟢 جدید | ✅ payouts/handler.go | ✅ payouts.Service.ListAll (+فیلتر وضعیت و نام ارائه‌دهنده) | ✅ admin | ✅ cursor/limit/status | ✅ | n/a | ✅ integration جدید |
| POST /api/v1/admin/payouts/:id/approve,reject,processing,paid,fail | ✅ | ✅ گذارهای اتمی | ✅ admin | ✅ | ✅ | n/a | ✅ |

### ۱.۲ قواعد کسب‌وکار (spec ↔ کد)

| قاعده | وضعیت اعمال | محل |
|---|---|---|
| Rate limit ورود/ثبت‌نام/رفرش | ✅ | internal/auth/rate.go، handler.go:88,125,151 |
| بازپرداخت فقط یک‌بار | ✅ fingerprint «refund\|bookingID» + hold باید settled باشد | internal/wallet/holds.go:256-394 |
| پنجره اختلاف | ✅ | internal/booking/booking.go:441-473 |
| مهلت لغو | ✅ | booking/booking.go:400-439 |
| انقضای پرداخت رزرو | ✅ | booking/booking.go:766-838 |
| محافظت از آخرین مدیر | ✅ قفل advisory + شمارش | internal/identity/store.go:414,427 |
| حداقل مبلغ درگاه (۱۰٬۰۰۰ ریال) | ✅ | booking/booking.go:60 |
| حداقل مبلغ تسویه (PAYOUT_MIN_AMOUNT_IRR) | ✅ | payouts/service.go:76-78 |
| گذارهای وضعیت اتمی + audit | ✅ | booking/booking.go transition، payouts/service.go:274-390 |
| پرداخت نامشخص (verification_unknown) | ✅ علامت‌گذاری محافظه‌کارانه + ReconcileUnknown | payments/service.go:253-292 |

### ۱.۳ جاب‌های پس‌زمینه

جاب‌ها طبق طراحی مستند (`docs/architecture.md:25` و ADR ها) به‌صورت «فرمان عملیاتی» اجرا می‌شوند که زمان‌بند بیرونی (cron / k8s CronJob) فراخوانی‌اش می‌کند:

| جاب | فرمان | عملکرد |
|---|---|---|
| رفع ابهام پرداخت‌های نامشخص | `payments-reconcile` | ✅ cmd/api/main.go:58-79 |
| تسویه خودکار پس از پنجره اختلاف | `bookings-settle-expired` | ✅ main.go:80-88 |
| انقضای رزروهای pending_payment | `bookings-expire-payments` | ✅ main.go:89-97 |
| همگرایی تسویه/کیف پول | `payouts-reconcile`, `wallet-reconcile` | ✅ main.go:98-107, 194-232 |

⚠️ `cmd/worker/` خالی است. برای اطمینان از «واقعاً اجرا شدن»، یک runner دوره‌ای داخلی به آن اضافه شد که همین چهار فرمان را با فاصله زمانی قابل‌تنظیم از env اجرا می‌کند (`WORKER_*`)، بدون تغییر در رفتار فرمان‌های CLI موجود.

### ۱.۴ متغیرهای محیطی

همه متغیرها در `internal/platform/config.go:123-263` خوانده و در استارتاپ اعتبارسنجی می‌شوند (SECRET ≥32 نویسه، URL های مطلق، TTL>0، PAYOUT_MIN_AMOUNT_IRR>1، PAYMENT_RETURN_URL در production الزامی). فهرست کامل با توضیح در `.env.example` و README موجود است. 🟢 متغیرهای `WORKER_*` برای runner جدید به `.env.example` اضافه شد.

## بخش ۲ — فرانت (beautyra)

### ۲.۱ Endpoint → صفحه / نقش

| Endpoint | نقش | صفحه/کامپوننت | از ناوبری قابل‌دسترس | حالت بارگذاری/خالی/خطا | بازخورد موفقیت |
|---|---|---|---|---|---|
| auth/* | همه | /login /register، AccountMenu | ✅ | ✅ | ✅ |
| GET /services (+category) | عمومی | / (ServiceListing) | ✅ | ✅ | — |
| GET /services/:id | عمومی | /services/[id] | ✅ | ✅ | — |
| GET availability | مشتری | /book/[serviceId] | ✅ | ✅ | — |
| POST /bookings + zarinpal | مشتری | /book/[serviceId]/confirm | ✅ | ✅ | ریدایرکت به نتیجه پرداخت |
| GET /bookings, /:id, cancel, confirm-completion, dispute | مشتری | /dashboard/bookings* | ✅ | ✅ | ✅ Dialog ها |
| wallet + transactions + topup | همه/مشتری | /wallet، /wallet/charge | ✅ | ✅ | ✅ |
| payment result (GET /payments/:id) | مشتری | /wallet/payment/result | ✅ ریدایرکت از درگاه | ✅ | 🟢 polling برای وضعیت نامشخص اضافه شد |
| provider profile/services/working-hours/time-off/bookings/payouts | ارائه‌دهنده | /provider/* | ✅ | ✅ | ✅ |
| GET/PUT admin/users + roles | مدیر | /admin/users | ✅ | ✅ | ✅ |
| 🟢 GET /admin/providers | مدیر | /admin/providers | ✅ | 🟢 list-based | ✅ per-row |
| PATCH admin verification | مدیر | /admin/providers | ✅ | ✅ | ✅ per-row |
| 🟢 GET /admin/bookings | مدیر | /admin/bookings | ✅ | 🟢 جدید | ✅ per-row |
| POST admin refund / dispute-resolution | مدیر | /admin/bookings | ✅ | ✅ Dialog | ✅ |
| 🟢 GET /admin/payouts | مدیر | /admin/payouts | ✅ | 🟢 list-based | ✅ per-row |
| POST admin payout lifecycle | مدیر | /admin/payouts | ✅ | ✅ Dialog پرداخت | ✅ |

### ۲.۲ سفرهای نقش‌ها (نتیجه نهایی)

**مشتری:** ثبت‌نام ✅، ورود/خروج/تمدید نشست ✅، مرور خدمات + فیلتر دسته ✅، جزئیات خدمت ✅، دسترسی‌پذیری ✅، رزرو با کیف پول ✅، رزرو با زرین‌پال ✅، صفحه نتیجه پرداخت 🟢 (polling وضعیت نامشخص)، تاریخچه رزرو ✅، لغو ✅، تأیید تکمیل ✅، اختلاف ✅، موجودی و تاریخچه ✅، شارژ کیف پول ✅.

**ارائه‌دهنده:** نمایه ✅، خدمات ✅، ساعات کاری ✅، مرخصی 🟢 (ورودی تاریخ/ساعت فارسی جایگزین ISO خام)، رزروها ✅، شروع/اعلام تکمیل/لغو ✅، درخواست تسویه + فهرست ✅، درآمد و مبالغ رزروشده ✅.

**مدیر:** کاربران و نقش‌ها ✅، 🟢 فهرست و تأیید ارائه‌دهندگان، 🟢 بازپرداخت از ردیف فهرست رزروها، 🟢 حل اختلاف از ردیف رزروهای مورد اختلاف، 🟢 چرخه کامل تسویه از فهرست، جست‌وجوی رزرو برای بازپرداخت/اختلاف 🟢.

### ۲.۳ نشتی‌های فنی (R2/R3) — فهرست کامل و وضعیت تعمیر

| فایل | محل | متن مخرب | تعمیر |
|---|---|---|---|
| src/config/messages.fa.ts:444 | صفحه /admin/providers | «فهرست ارائه‌دهندگان از API پشتیبانی نمی‌شود؛ شناسه را...» | حذف؛ صفحه لیست‌محور شد |
| src/config/messages.fa.ts:457 | /admin/disputes | «فهرست اختلاف‌ها از API در دسترس نیست؛...» | حذف؛ ادغام در /admin/bookings |
| src/config/messages.fa.ts:467 | /admin/payouts | «فهرست درخواست‌های تسویه برای مدیر در API وجود ندارد؛...» | حذف؛ صفحه لیست‌محور شد |
| src/config/messages.fa.ts:447 | فرم بازپرداخت | نمایش فیلد «کلید جلوگیری از ثبت تکراری» | حذف فیلد؛ کلید مخفی در state |
| src/config/messages.fa.ts:439,446,456,468 | فرم‌های ادمین | ورودی دستی «شناسه ...» (R3) | حذف؛ انتخاب از ردیف |
| src/config/messages.fa.ts:51 | booking.note | «...خطای ۴۰۹...» | بازنویسی فارسی محاوره‌ای |
| src/config/messages.fa.ts:63 | gatewayNote | «...تأیید سرور...» | بازنویسی |
| src/config/messages.fa.ts:237 | splitHint | «...محدودیت ساعت پایان در API...» | بازنویسی |
| src/config/messages.fa.ts:243,244,253,254 | فرم مرخصی | ورودی ISO با آفست منطقه زمانی | ورودی تاریخ شمسی + ساعت |
| src/config/messages.fa.ts:109 | نتیجه پرداخت | «شناسه پرداخت» (نمایش شناسه خام) | «کد پیگیری پرداخت» |
| src/config/messages.fa.ts:151 | لغو رزرو | «شناسه رزرو معتبر نیست» | بازنویسی |
| src/lib/api/mock/provider-meta.ts | صفحه اصلی | داده ساختگی نام/امتیاز ارائه‌دهنده | حذف وابستگی مسیر production؛ نام واقعی ارائه‌دهنده از بک‌اند |

### ۲.۴ صفحات مرده / دکمه‌های بی‌عملکرد / داده ساختگی

- `/admin/refunds` و `/admin/disputes` → ریدایرکت به `/admin/bookings` (لینک‌های قدیمی نمی‌شکنند).
- `src/lib/api/mock/provider-meta.ts` → از مسیر حذف شد (متغیر USE_MOCK_META و ماژول mock حذف؛ نام ارائه‌دهنده از `GET /api/v1/services`).
- `src/config/filter-options.ts` (شهر/محله ثابت) → ⚠️ باقی مانده با دلیل: مدل داده آدرس در بک‌اند وجود ندارد (بدون ستون شهر/محله برای هیچ ارائه‌دهنده‌ای). افزودن آن نیازمند تصمیم محصولی (مهاجرت داده) است؛ فیلترهای فعلی در حافظه اعمال می‌شوند، نشتی فنی ایجاد نمی‌کنند و در سفرهای الزامی نقش‌ها (فیلتر دسته‌بندی) نقشی ندارند.
- امتیاز و تعداد نظرات کارت‌ها → حذف شد چون هیچ منبع داده واقعی در API وجود ندارد (نمایش داده ساختگی نقض R1-d است).

### ۲.۵ محافظت مسیرها و نشست

- middleware.ts فقط نشست معتبر را چک می‌کند و تفکیک نقش در `requireRole` هر صفحه است — الگوی موجود و درست؛ هیچ صفحه مدیریتی بدون `requireRole("admin")` نیست.
- رفرش توکن: تک‌in-flight در `lib/auth/refresh.ts` با ابطال خانواده توکن در replay؛ بدون حلقه. ✅

## بخش ۳ — خلاصه شکاف‌ها و تصمیم‌ها

1. سه endpoint لیست مدیریتی (providers / payouts / bookings) وجود نداشت → **در بک‌اند اضافه شد** (R1) با cursor pagination، مجوز admin، پاسخ Problem، اعتبارسنجی، تست و به‌روزرسانی OpenAPI.
2. نمایش نام ارائه‌دهنده در کارت‌های عمومی → فیلد additive `provider_display_name` به `GET /api/v1/services` و `GET /api/v1/services/{id}` اضافه شد؛ mock حذف شد.
3. فیلد 24:00 برای بازه کاری شبانه (backend-gaps بند ۱۶) → ⚠️ تغییر قرارداد بزرگ‌تر از دامنه این به‌روزرسانی؛ رفتار فعلی (تقسیم تا ۲۳:۵۹) حفظ شد و متن UI دیگر به محدودیت فنی اشاره نمی‌کند.
4. نقش «مشتری» در بک‌اند: ستون نام نمایشی برای کاربران عادی وجود ندارد؛ فهرست مدیریتی رزروها به‌جای نام، ایمیل/تلفن (اطلاعات تماس ایمن، فقط مدیر) برمی‌گرداند.

## گزارش پیشرفت (Progress Log)

### ۱۴۰۵/۰۷/۲۹ (2026-10-21)
- **بک‌اند** — تعمیر `internal/catalog/services.go::GetForBookingTx` (SELECT ۹ ستونی ولی scan ۱۰ مقصدی؛ `p.display_name` اضافه شد): کل `go test ./... -count=1` با `DATABASE_URL` سبز شد (12 پکیج، شامل integration).
- **بک‌اند** — سه مسیر لیست مدیریتی تأیید/تکمیل شد: `GET /api/v1/admin/providers` (internal/providerapi/handler.go)، `GET /api/v1/admin/bookings` (internal/booking/handler.go)، `GET /api/v1/admin/payouts` (internal/payouts/handler.go:33).
- **بک‌اند** — `api/openapi.yaml` به‌روزرسانی شد (سه مسیر + اسکیماهای AdminProvider/Page، AdminBooking/Page، AdminPayout/Page + `provider_display_name` اختیاری در Service) و بایت‌به‌بایت در `beautyra/openapi.yaml` آینه شد (هش SHA256 یکسان: `8C986D5D…C4E7`).
- **بک‌اند** — آزمون‌های integration جدید: `TestAdminProviderListAPI` (providerapi/handler_integration_test.go:388+)، `TestAdminBookingListAPI` (booking/integration_test.go:561+)، `TestAdminPayoutListAPI` (payouts/integration_test.go:567+) — همگی سبز.
- **بک‌اند** — runner فرمان‌های عملیاتی در `cmd/worker/main.go` ساخته و متغیرهای `WORKER_*` در `.env.example` مستند شد.
- **بک‌اند** — پیشرفت نهایی: `go build ./...` ✅ | `go vet ./...` ✅ | `go test ./... -count=1` با DB ✅.
- **فرانت** — `src/lib/api/schema.gen.ts` با `npm run gen:api` از spec بازتولید شد؛ لایه `src/lib/api/admin.ts` (getAdminProviders/getAdminBookings/getAdminPayouts) + تایپ‌ها اضافه شد.
- **فرانت** — صفحات لیست‌محور ساخته شد: `/admin/providers`، `/admin/bookings`، `/admin/payouts` (اندازه هر صفحه، فیلتر وضعیت، صفحه‌بندی cursor)؛ فرم‌های دستی شناسه (`AdminRefundForm`, `AdminDisputeForm`, `AdminPayoutForm`, `ProviderVerificationForm`) حذف و با کنترل‌های ردیفی MUI (`AdminProviderVerificationControls`, `AdminBookingActions`, `AdminPayoutActions`) جایگزین شد؛ `/admin/refunds` و `/admin/disputes` فقط ریدایرکت به `/admin/bookings` هستند؛ ناوبری `AccountMenu.tsx` هماهنگ شد.
- **فرانت** — نشتی‌های R2/R3 (بخش ۲.۳) پاک شد؛ کلیدهای بلااستفاده‌ی شناسه‌محور حذف و کلیدهای جدید `admin.*` به `src/config/messages.fa.ts` اضافه شد.
- **فرانت** — ورودی مرخصی: فرم تاریخ شمسی + ساعت (جداکننده فاصله یا `T`)، تبدیل در `src/lib/provider/jalali-date.ts` و اعمال آفست ثابت تهران (+03:30، بدون تغییر ساعتی در طول سال) در `src/lib/provider/time-off-actions.ts::withTehranOffset`؛ یادداشت منطقه زمانی بازنویسی شد («ساعت‌ها بر اساس زمان رسمی تهران»).
- **فرانت** — آزمون محافظ `src/config/messages.guard.test.ts` (۵ آزمون): منع واژه‌های فنی در همه‌ی پیام‌ها + پوشش لیبل enumهای وضعیت رزرو/تسویه/احراز.
- **فرانت** — بازخورد نهایی: `npm run lint` ✅ | `npm run typecheck` ✅ | `npm run test` ✅ (22 فایل، ۱۳۵ آزمون) | `npm run build` ✅.
- **NEXT:** تثبیت گیت (کامیت تغییرات فعلی در دو مخزن؛ شاخه بک‌اند `main` بدون کامیت است) و سپس بازبینی ادامه‌ی ردیف‌های «بخش ۳» با تصمیم محصولی (فیلتر شهر/محله نیازمند ADR و مهاجرت داده).
