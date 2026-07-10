import {
  DEFAULT_LOCALE,
  LOCALE_HREFLANG,
  type LocaleKey,
} from "@/i18n/constants";
import { getPageUrl } from "@/shared/utils/metadata";

type Props = {
  locale: LocaleKey;
  description: string;
};

const AUTHOR_URL = "https://github.com/AlexMubarakshin";
const REPO_URL = "https://github.com/AlexMubarakshin/tonify";

/**
 * Site-wide JSON-LD (WebSite + SoftwareApplication + Person). Synchronous
 * because it renders under the NextIntlClientProvider boundary — the caller
 * resolves the localized `description`.
 */
export const StructuredData = ({ locale, description }: Props) => {
  const pageUrl = getPageUrl(locale);
  const rootUrl = getPageUrl(DEFAULT_LOCALE);
  const inLanguage = LOCALE_HREFLANG[locale];

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${rootUrl}#website`,
        url: rootUrl,
        name: "TONify",
        inLanguage,
        publisher: { "@id": `${rootUrl}#person` },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${rootUrl}#app`,
        name: "TONify — TON Address Converter",
        url: pageUrl,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        description,
        inLanguage,
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        author: { "@id": `${rootUrl}#person` },
      },
      {
        "@type": "Person",
        "@id": `${rootUrl}#person`,
        name: "Alex Mubarakshin",
        url: AUTHOR_URL,
        sameAs: [AUTHOR_URL, REPO_URL],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};
