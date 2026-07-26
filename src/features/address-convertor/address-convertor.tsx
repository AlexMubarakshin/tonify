"use client";

import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { Textarea } from "@nextui-org/input";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Switch,
  Tooltip,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";

import {
  parseAndResult,
  addressResultsToTableData,
  explorerUrl,
  EXAMPLE_ADDRESS,
} from "./helpers";
import { AddressResultTableData, AddressResultTableDataKey } from "./types";
import { useBeforeUnload } from "./use-berfore-unload";
import { AddressConvertorHeaderColLabel } from "./address-convertor-header-col-label";
import { AddressConvertorTablePlaceholder } from "./address-convertor-table-placeholder";
import { AddressCell } from "./address-convertor-cell";
import { AddressConvertorDownload } from "./address-convertor-download";

const BASE_COLUMNS: AddressResultTableDataKey[] = [
  "toStringBounceable",
  "toStringNonBounceable",
  "toRawString",
  "normalized",
];

const TESTNET_COLUMNS: AddressResultTableDataKey[] = [
  "testnetBounceable",
  "testnetNonBounceable",
];

const ExternalLinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <path d="M15 3h6v6M10 14 21 3" />
  </svg>
);

export const AddressConverter = () => {
  const t = useTranslations();
  const [raw, setRaw] = useState("");
  const [showTestnet, setShowTestnet] = useState(false);

  const { results, invalidCount } = useMemo(() => parseAndResult(raw), [raw]);
  const rows = useMemo(() => addressResultsToTableData(results), [results]);

  useBeforeUnload(raw);

  const handleRawChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setRaw(e.target.value);
  }, []);

  const columnKeys = useMemo<string[]>(
    () => [...BASE_COLUMNS, ...(showTestnet ? TESTNET_COLUMNS : []), "actions"],
    [showTestnet]
  );
  const columns = useMemo(() => columnKeys.map((key) => ({ key })), [columnKeys]);

  const validCount = results.length;
  const hasInput = raw.trim().length > 0;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
      {/* Intro */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          {t("index-page.title")}
        </h1>
        <p className="text-default-500 max-w-2xl">{t("index-page.description")}</p>
      </div>

      {/* Input */}
      <div className="flex flex-col gap-3">
        <Textarea
          value={raw}
          minRows={3}
          variant="bordered"
          label={t("index-page.textareaLabel")}
          placeholder={t("index-page.textareaPlaceholder")}
          onChange={handleRawChange}
          classNames={{ input: "font-mono text-sm" }}
        />

        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="flat"
              color="primary"
              onPress={() => setRaw((prev) => (prev ? `${prev.trim()}\n${EXAMPLE_ADDRESS}` : EXAMPLE_ADDRESS))}
            >
              {t("index-page.loadExample")}
            </Button>
            <Button
              size="sm"
              variant="light"
              isDisabled={!hasInput}
              onPress={() => setRaw("")}
            >
              {t("index-page.clear")}
            </Button>
            <AddressConvertorDownload rows={rows} showTestnet={showTestnet} />
          </div>

          <div className="flex items-center gap-4">
            {hasInput && (
              <div className="flex items-center gap-3 text-sm">
                <span className="text-success-600 dark:text-success font-medium">
                  {t("index-page.validCount", { count: validCount })}
                </span>
                {invalidCount > 0 && (
                  <span className="text-danger font-medium">
                    {t("index-page.invalidCount", { count: invalidCount })}
                  </span>
                )}
              </div>
            )}
            <Switch
              size="sm"
              isSelected={showTestnet}
              onValueChange={setShowTestnet}
            >
              <span className="text-sm text-default-600">{t("index-page.showTestnet")}</span>
            </Switch>
          </div>
        </div>
      </div>

      {/* Results */}
      <Table
        aria-label={t("index-page.conversionResults")}
        isHeaderSticky
        classNames={{
          base: "max-h-[60vh] overflow-auto",
          wrapper: "p-0 shadow-medium rounded-large",
          th: "bg-default-100 text-default-600",
          td: "py-3",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>
              {column.key === "actions" ? (
                <span className="sr-only">{t("index-page.explorer")}</span>
              ) : (
                <AddressConvertorHeaderColLabel colKey={column.key as AddressResultTableDataKey} />
              )}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody<AddressResultTableData>
          items={rows}
          emptyContent={
            <AddressConvertorTablePlaceholder empty={!hasInput} nonValid={hasInput && validCount === 0} />
          }
        >
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === "actions" ? (
                    <Tooltip content={t("index-page.openInExplorer")} closeDelay={0}>
                      <Button
                        as="a"
                        href={explorerUrl(item.normalized)}
                        target="_blank"
                        rel="noreferrer"
                        isIconOnly
                        size="sm"
                        variant="light"
                        radius="full"
                        className="text-default-400 data-[hover=true]:text-primary"
                        aria-label={t("index-page.openInExplorer")}
                      >
                        <ExternalLinkIcon />
                      </Button>
                    </Tooltip>
                  ) : (
                    <AddressCell value={item[columnKey as AddressResultTableDataKey] as string | undefined} />
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
