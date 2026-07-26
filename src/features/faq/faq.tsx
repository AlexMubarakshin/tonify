"use client";

import { useTranslations } from "next-intl";

export type FaqItem = { q: string; a: string };

/**
 * Client component (matches the app's client-side i18n pattern via
 * NextIntlClientProvider). The FAQ JSON-LD contains only text, so no
 * build-time/server data is required.
 */
export const Faq = () => {
  const t = useTranslations("faq");
  const items = t.raw("items") as FaqItem[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <section className="border-t border-divider bg-default-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">{t("title")}</h2>

        <dl className="flex flex-col gap-6">
          {items.map((item, index) => (
            <div key={index}>
              <dt className="text-lg font-semibold mb-1">{item.q}</dt>
              <dd className="text-default-500 leading-relaxed">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
};
