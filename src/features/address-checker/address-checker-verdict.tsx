"use client";

import { useTranslations } from "next-intl";
import { Chip } from "@nextui-org/react";
import { CopyButton } from "../address-convertor/address-convertor-cell";
import type { AddressForms, CheckResult } from "./validate";

const FORM_KEYS: (keyof AddressForms)[] = [
  "bounceable",
  "nonBounceable",
  "raw",
  "testnetBounceable",
  "testnetNonBounceable",
];

const ValidIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <path d="m8 12 3 3 5-6" />
  </svg>
);

const InvalidIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <path d="m15 9-6 6M9 9l6 6" />
  </svg>
);

type FieldProps = {
  label: string;
  children: React.ReactNode;
};

const Field = ({ label, children }: FieldProps) => (
  <div className="flex flex-col gap-0.5">
    <dt className="text-xs uppercase tracking-wide text-default-400">{label}</dt>
    <dd className="text-sm font-medium">{children}</dd>
  </div>
);

type Props = {
  result: CheckResult;
};

export const AddressCheckerVerdict = ({ result }: Props) => {
  const t = useTranslations("checker");

  if (result.status === "empty") {
    return (
      <div className="rounded-large border border-dashed border-divider px-4 py-8 text-center text-sm text-default-400">
        {t("emptyHint")}
      </div>
    );
  }

  if (result.status === "invalid") {
    return (
      <div className="rounded-large border border-danger-200 bg-danger-50 dark:bg-danger-50/10 overflow-hidden">
        <div className="flex items-start gap-3 px-4 py-4">
          <span className="text-danger mt-0.5 shrink-0">
            <InvalidIcon />
          </span>
          <div className="flex flex-col gap-1 min-w-0">
            <p className="font-semibold text-danger">{t("status.invalid")}</p>
            <p className="text-sm text-default-600 leading-relaxed">
              {t(`issue.${result.issue.code}`, result.issue.params)}
            </p>
            <code className="mt-1 break-all font-mono text-xs text-default-500">
              {result.cleaned}
            </code>
          </div>
        </div>
      </div>
    );
  }

  const chips = [
    {
      key: "network",
      label: t(`value.${result.network}`),
      color: result.network === "testnet" ? ("warning" as const) : ("success" as const),
    },
    {
      key: "bounceable",
      label: result.bounceable ? t("value.bounceable") : t("value.nonBounceable"),
      color: "default" as const,
    },
    {
      key: "chain",
      label: t(`value.${result.workchain === -1 ? "masterchain" : "basechain"}`),
      color: result.workchain === -1 ? ("warning" as const) : ("default" as const),
    },
  ];

  return (
    <div className="rounded-large border border-success-200 bg-success-50 dark:bg-success-50/10 overflow-hidden">
      <div className="flex items-start gap-3 px-4 py-4 border-b border-divider">
        <span className="text-success-600 dark:text-success mt-0.5 shrink-0">
          <ValidIcon />
        </span>
        <div className="flex flex-col gap-2 min-w-0">
          <p className="font-semibold text-success-700 dark:text-success">
            {t("status.valid")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <Chip key={chip.key} size="sm" variant="flat" color={chip.color}>
                {chip.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-background px-4 py-4 flex flex-col gap-5">
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Field label={t("field.format")}>{t(`value.${result.inputFormat}`)}</Field>
          <Field label={t("field.network")}>{t(`value.${result.network}`)}</Field>
          <Field label={t("field.workchain")}>
            <span className="font-mono">{result.workchain}</span>
          </Field>
          <Field label={t("field.checksum")}>
            <span className="text-success-600 dark:text-success">
              {result.inputFormat === "raw" ? t("value.noChecksum") : t("value.checksumOk")}
            </span>
          </Field>
        </dl>

        {result.notes.length > 0 && (
          <ul className="flex flex-col gap-2">
            {result.notes.map((note) => (
              <li
                key={note}
                className="text-sm text-default-500 leading-relaxed pl-4 border-l-2 border-default-200"
              >
                {t(`note.${note}`)}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold">{t("forms.title")}</h3>
          <div className="overflow-x-auto rounded-medium border border-divider">
            <table className="w-full text-left text-sm border-collapse">
              <tbody>
                {FORM_KEYS.map((key) => (
                  <tr key={key} className="border-b border-divider last:border-b-0">
                    <th
                      scope="row"
                      className="px-3 py-2 font-medium whitespace-nowrap text-default-500 align-top"
                    >
                      {t(`forms.${key}`)}
                    </th>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <code className="break-all font-mono text-xs sm:text-sm">
                          {result.forms[key]}
                        </code>
                        <CopyButton value={result.forms[key]} />
                      </div>
                    </td>
                  </tr>
                ))}
                <tr>
                  <th
                    scope="row"
                    className="px-3 py-2 font-medium whitespace-nowrap text-default-500 align-top border-t border-divider"
                  >
                    {t("field.accountId")}
                  </th>
                  <td className="px-3 py-2 border-t border-divider">
                    <code className="break-all font-mono text-xs sm:text-sm text-default-500">
                      {result.accountId}
                    </code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
