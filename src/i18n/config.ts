export const locales = ["gu", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale = "gu" as const;
