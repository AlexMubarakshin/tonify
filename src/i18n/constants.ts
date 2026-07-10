export const LOCALES = [
  "en",
  "ru",
  'zh-cn',
] as const;

export const DEFAULT_LOCALE = LOCALES[0];

export type LocaleKey = (typeof LOCALES)[number];

export const LOCALE_EMOJI: Record<LocaleKey, string> = {
  en: "🇺🇸",
  ru: "🇷🇺",
  "zh-cn": "🇨🇳",
};

export const LOCALE_LABELS: Record<LocaleKey, string> = {
  en: "English",
  ru: "Русский",
  "zh-cn": "简体中文",
}

// BCP-47 codes emitted as hreflang values (route path may differ, e.g. /zh-cn -> zh-Hans)
export const LOCALE_HREFLANG: Record<LocaleKey, string> = {
  en: "en",
  ru: "ru",
  "zh-cn": "zh-Hans",
};

// og:locale values
export const LOCALE_OG: Record<LocaleKey, string> = {
  en: "en_US",
  ru: "ru_RU",
  "zh-cn": "zh_CN",
};
