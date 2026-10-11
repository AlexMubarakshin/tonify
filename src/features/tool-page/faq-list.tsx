import type { FaqItem } from "@/features/faq/faq";

/** Question/answer list used by the tool pages' FAQ sections. */
export const FaqList = ({ items }: { items: FaqItem[] }) => (
  <dl className="flex flex-col gap-6">
    {items.map((item, index) => (
      <div key={index}>
        <dt className="text-lg font-semibold mb-1">{item.q}</dt>
        <dd className="text-default-500 leading-relaxed">{item.a}</dd>
      </div>
    ))}
  </dl>
);
