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
