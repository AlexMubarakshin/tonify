import { LOCALE_HREFLANG, type LocaleKey } from "@/i18n/constants";
import type { FaqItem } from "@/features/faq/faq";

type ToolPageGraphOptions = {
  locale: LocaleKey;
  pageUrl: string;
  converterUrl: string;
  name: string;
  description: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  category: string;
  faq: FaqItem[];
  featureList?: string[];
  /** Additional graph nodes, e.g. a HowTo. */
  extra?: Record<string, unknown>[];
};

/** WebApplication + BreadcrumbList + FAQPage graph shared by the tool pages. */
export function buildToolPageGraph(options: ToolPageGraphOptions) {
  const { locale, pageUrl, converterUrl, faq } = options;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${pageUrl}#app`,
        name: options.name,
        url: pageUrl,
        applicationCategory: options.category,
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        description: options.description,
        inLanguage: LOCALE_HREFLANG[locale],
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        ...(options.featureList ? { featureList: options.featureList } : {}),
      },
      ...(options.extra ?? []),
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: options.breadcrumbHome, item: converterUrl },
          { "@type": "ListItem", position: 2, name: options.breadcrumbCurrent, item: pageUrl },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}

/** Serialized JSON-LD script. `<` is escaped so translated text cannot close the tag. */
export const JsonLd = ({ data }: { data: unknown }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
  />
);
