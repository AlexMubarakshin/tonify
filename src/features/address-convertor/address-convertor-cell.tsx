"use client";

import { useCallback, useState } from "react";
import { Button, Tooltip } from "@nextui-org/react";
import { useTranslations } from "next-intl";

const CopyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/** Middle-truncate a long string, keeping the head and tail readable. */
function truncateMiddle(value: string, head = 10, tail = 8): string {
  if (value.length <= head + tail + 1) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

/** Copy text with a legacy fallback for insecure contexts where the async API is blocked. */
async function copyToClipboard(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // fall through to legacy path
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

type CopyButtonProps = { value: string };

export const CopyButton = ({ value }: CopyButtonProps) => {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(value);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }, [value]);

  return (
    <Tooltip content={copied ? t("index-page.copied") : t("index-page.copy")} closeDelay={0}>
      <Button
        isIconOnly
        size="sm"
        variant="light"
        radius="full"
        className="min-w-7 w-7 h-7 text-default-400 data-[hover=true]:text-primary"
        aria-label={t("index-page.copy")}
        onPress={handleCopy}
      >
        <span className={copied ? "text-success" : undefined}>
          {copied ? <CheckIcon /> : <CopyIcon />}
        </span>
      </Button>
    </Tooltip>
  );
};

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
