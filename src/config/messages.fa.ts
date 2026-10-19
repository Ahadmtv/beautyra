export const messages = {
  "meta.title": "بیوتیرا | رزرو نوبت خدمات",
  "meta.description": "رزرو آنلاین نوبت خدمات نزد ارائه‌دهندگان تأییدشده",
  "brand.name": "بیوتیرا",
  "brand.suffix": "نوبت‌دهی",
  "header.login": "ورود",
  "footer.copyright": "تمام حقوق این سامانه محفوظ است.",
  "home.title": "خدمات و ارائه‌دهندگان",
  "home.placeholder": "فهرست خدمات به‌زودی نمایش داده می‌شود.",
  "home.specialties": "تخصص‌ها",
  "common.loading": "در حال بارگذاری",
  "common.close": "بستن",
  "common.loadMore": "نمایش بیشتر",
  "common.selectPlaceholder": "انتخاب کنید",
  "button.loading": "در حال انجام",
  "badge.verified": "تأیید شده",
  "rating.label": "امتیاز {value} از ۵",
  "rating.count": "{count} نفر",
  "empty.title": "موردی یافت نشد",
  "validation.required": "این فیلد الزامی است.",
  "filter.label": "فیلترهای جستجو",
  "filter.city": "شهر",
  "filter.neighborhood": "محله‌ها",
  "filter.cityPlaceholder": "همه شهرها",
  "filter.neighborhoodPlaceholder": "همه محله‌ها",
  "filter.open": "فیلترها",
  "filter.apply": "اعمال فیلترها",
  "filter.search": "جستجو",
  "filter.searchLabel": "نام خدمت یا ارائه‌دهنده",
  "filter.searchPlaceholder": "مثلاً: کوتاهی مو",
  "devUi.title": "نمایش اجزای رابط کاربری",
  "devUi.sectionButtons": "دکمه‌ها",
  "devUi.sectionForms": "فرم‌ها",
  "devUi.sectionBadges": "نشان و امتیاز",
  "devUi.sectionFeedback": "مودال، کشو و پیام",
  "devUi.sectionFilters": "نوار فیلتر",
  "devUi.variantPrimary": "اصلی",
  "devUi.variantOutline": "حاشیه‌دار",
  "devUi.variantGhost": "شفاف",
  "devUi.stateLoading": "در حال انجام",
  "devUi.stateDisabled": "غیرفعال",
  "devUi.inputLabel": "نمونه ورودی",
  "devUi.selectLabel": "نمونه انتخاب",
  "devUi.textareaLabel": "نمونه متن",
  "devUi.hint": "راهنمای نمونه",
  "devUi.openModal": "باز کردن مودال",
  "devUi.openDrawer": "باز کردن کشو",
  "devUi.showToast": "نمایش پیام",
  "devUi.modalTitle": "نمونه مودال",
  "devUi.drawerTitle": "نمونه کشو",
  "devUi.demoBody": "این یک متن نمونه است.",
  "devUi.toastMessage": "عملیات با موفقیت انجام شد.",
} as const;

export type MessageKey = keyof typeof messages;

type MessageVars = Record<string, string | number>;

export function t(key: MessageKey, vars?: MessageVars): string {
  const template: string = messages[key];
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}
