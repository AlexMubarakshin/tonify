"use client";

import { CopyButton } from "@/shared/ui/copy-button";

/** Middle-truncate a long string, keeping the head and tail readable. */
function truncateMiddle(value: string, head = 10, tail = 8): string {
  if (value.length <= head + tail + 1) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

type AddressCellProps = { value: string | undefined };

export const AddressCell = ({ value }: AddressCellProps) => {
  if (!value) {
    return <span className="text-default-300">—</span>;
  }

  return (
    <div className="flex items-center gap-1.5 group whitespace-nowrap">
      <span className="font-mono text-sm text-foreground/90" title={value}>
        {truncateMiddle(value)}
      </span>
      <CopyButton value={value} />
    </div>
  );
};
