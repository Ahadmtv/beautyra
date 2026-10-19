export const messages = {
  "meta.title": "بیوتیرا | رزرو نوبت خدمات",
  "meta.description": "رزرو آنلاین نوبت خدمات نزد ارائه‌دهندگان تأییدشده",
  "brand.name": "بیوتیرا",
  "brand.suffix": "نوبت‌دهی",
  "header.login": "ورود",
  "footer.copyright": "تمام حقوق این سامانه محفوظ است.",
  "home.title": "خدمات و ارائه‌دهندگان",
  "home.placeholder": "فهرست خدمات به‌زودی نمایش داده می‌شود.",
} as const;

export type MessageKey = keyof typeof messages;

export function t(key: MessageKey): string {
  return messages[key];
}
