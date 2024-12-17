import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { LocaleKey } from "./constants";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as LocaleKey)) {
    locale = routing.defaultLocale;
  }

  return {
    timeZone: "Europe/London",
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
