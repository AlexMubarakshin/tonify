import { AddressResultTableData } from "./types";

type ExportField = { key: keyof AddressResultTableData; label: string };

// Stable, locale-independent labels so exported files stay machine-parseable.
const BASE_FIELDS: ExportField[] = [
  { key: "toStringBounceable", label: "Bounceable" },
  { key: "toStringNonBounceable", label: "Non-bounceable" },
  { key: "toRawString", label: "Raw" },
  { key: "normalized", label: "Normalized" },
];

const TESTNET_FIELDS: ExportField[] = [
  { key: "testnetBounceable", label: "Testnet bounceable" },
  { key: "testnetNonBounceable", label: "Testnet non-bounceable" },
];

function exportFields(showTestnet: boolean): ExportField[] {
  return showTestnet ? [...BASE_FIELDS, ...TESTNET_FIELDS] : BASE_FIELDS;
}

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function rowsToCsv(rows: AddressResultTableData[], showTestnet: boolean): string {
  const fields = exportFields(showTestnet);
  const header = ["#", ...fields.map((f) => f.label)];
  const lines = [header.map(csvEscape).join(",")];

  rows.forEach((row, index) => {
    const cells = [String(index + 1), ...fields.map((f) => row[f.key] ?? "")];
    lines.push(cells.map((c) => csvEscape(String(c))).join(","));
  });

  return lines.join("\r\n");
}

export function rowsToTxt(rows: AddressResultTableData[], showTestnet: boolean): string {
  const fields = exportFields(showTestnet);
  const labelWidth = Math.max(...fields.map((f) => f.label.length)) + 1;

  const blocks = rows.map((row, index) => {
    const body = fields
      .map((f) => `  ${`${f.label}:`.padEnd(labelWidth + 1)} ${row[f.key] ?? "-"}`)
      .join("\n");
    return `Address ${index + 1}\n${body}`;
  });

  return `${blocks.join("\n\n")}\n`;
}

export function downloadTextFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
