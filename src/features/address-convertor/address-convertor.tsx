"use client";

import { ChangeEvent, useCallback, useState } from "react";
import { Textarea } from "@nextui-org/input";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

import { parseAndResult, addressResultsToTableData } from "./helpers";
import { AddressResultTableData, AddressResultTableDataKey } from "./types";
import { useBeforeUnload } from "./use-berfore-unload";
import { useTranslations } from "next-intl";
import { AddressConvertorHeaderColLabel } from "./address-convertor-header-col-label";
import { AddressConvertorTablePlaceholder } from "./address-convertor-table-placeholder";


const columns: { key: AddressResultTableDataKey }[] = [
  {
    key: "toStringBounceable",
  },
  {
    key: "toStringNonBounceable",
  },
  {
    key: "toRawString",
  },
  {
    key: "normalized",
  },
]

export const AddressConverter = () => {
  const t = useTranslations()
  const [raw, setRaw] = useState("");

  const parsed = parseAndResult(raw)

  useBeforeUnload(raw);

  const handleRawChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setRaw(e.target.value);
  }, [])

  return (
    <div className="overflow-hidden w-full h-[calc(100dvh-57px-14px)] relative flex">
      <div className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
        <Table
          aria-label={t('index-page.conversionResults')}
          className="p-6 min-h-0 flex-grow drop-shadow-xl"
          classNames={{ tbody: "min-h-0" }}
          isHeaderSticky
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>
                <AddressConvertorHeaderColLabel colKey={column.key} />
              </TableColumn>
            )}
          </TableHeader>
          <TableBody<AddressResultTableData>
            items={addressResultsToTableData(parsed)}
            emptyContent={<AddressConvertorTablePlaceholder empty={!raw} nonValid={!!raw && parsed.length === 0} />}
          >
            {(item) => (
              <TableRow key={item.key}>
                {(columnKey) => <TableCell><p className="text-bold text-sm capitalize text-default-500">{item[columnKey as unknown as AddressResultTableDataKey]}</p></TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="p-6 shadow-small ">
          <h1 className="text-2xl font-bold mb-2">{t('index-page.title')}</h1>
          <p className="text-gray-600 mb-4">
            {t('index-page.description')}
          </p>

          <Textarea
            className="mb-6"
            label={t('index-page.textareaLabel')}
            placeholder={t('index-page.textareaPlaceholder')}
            onChange={handleRawChange}
          />
        </div>
      </div>
    </div>
  )
}