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
        // Technical format names, intentionally untranslated — they are the same
        // tokens in every locale.
        featureList: [
          "Bounceable (EQ) address conversion",
          "Non-bounceable (UQ) address conversion",
          "Raw address conversion",
          "Normalized address output",
          "Testnet (kQ / 0Q) address conversion",
          "Bulk address validation",
          "CSV export",
        ],
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
