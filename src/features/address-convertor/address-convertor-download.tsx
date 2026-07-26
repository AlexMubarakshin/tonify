"use client";

import { useCallback } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { useTranslations } from "next-intl";

import { AddressResultTableData } from "./types";
import { rowsToCsv, rowsToTxt, downloadTextFile } from "./export";

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M7 10l5 5 5-5M12 15V3" />
  </svg>
);

type Props = {
  rows: AddressResultTableData[];
  showTestnet: boolean;
};

export const AddressConvertorDownload = ({ rows, showTestnet }: Props) => {
  const t = useTranslations();

  const handleAction = useCallback(
    (key: string) => {
      if (rows.length === 0) return;
      if (key === "csv") {
        downloadTextFile("tonify-addresses.csv", rowsToCsv(rows, showTestnet), "text/csv;charset=utf-8");
      } else if (key === "txt") {
        downloadTextFile("tonify-addresses.txt", rowsToTxt(rows, showTestnet), "text/plain;charset=utf-8");
      }
    },
    [rows, showTestnet]
  );

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <Button
          size="sm"
          variant="flat"
          isDisabled={rows.length === 0}
          startContent={<DownloadIcon />}
        >
          {t("index-page.download")}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={t("index-page.download")}
        onAction={(key) => handleAction(key as string)}
      >
        <DropdownItem key="csv" description=".csv · spreadsheet">CSV</DropdownItem>
        <DropdownItem key="txt" description=".txt · plain text">TXT</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
