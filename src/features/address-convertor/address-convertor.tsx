"use client";

import { ChangeEvent, ReactNode, useCallback, useState } from "react";
import { Textarea } from "@nextui-org/input";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

import { parseAndResult, addressResultsToTableData } from "./helpers";
import { AddressResultTableData, AddressResultTableDataKey } from "./types";
import { AddressConverterHeaderColTooltip } from "./address-convertor-header-col-tooltip";
import { useBeforeUnload } from "./use-berfore-unload";

const EMPTY_CONTENT = <span>No addresses to display. Start by entering an address below.</span>
const INVAMID_CONTENT_PROVIDED = <span><b className="text-red-300">No valid addresses found</b>. Please provide a valid address.</span>

const columns: { key: AddressResultTableDataKey, label: ReactNode }[] = [
  {
    key: "toStringBounceable", label: (
      <span>
        Address{" "}
        <AddressConverterHeaderColTooltip content={(<span className="max-w-sm text-current">A bounceable address is one that can receive messages that require a response, such as transactions. For more info, <a className="text-blue-400 underline" target="_blank" rel="noreferrer" href="https://docs.ton.org/v3/documentation/smart-contracts/addresses#bounceable-vs-non-bounceable-addresses">visit the documentation</a>.</span>)}>
          <span className="text-blue-400 cursor-pointer">Bouncable</span>
        </AddressConverterHeaderColTooltip>
      </span>
    )
  },
  {
    key: "toStringNonBounceable", label: (
      <span>Address{" "}
        <AddressConverterHeaderColTooltip content={(<span className="max-w-sm text-current">A non-bounceable address cannot receive messages that require a response, such as transactions. For more info, <a className="text-blue-400 underline" target="_blank" rel="noreferrer" href="https://docs.ton.org/v3/documentation/smart-contracts/addresses#bounceable-vs-non-bounceable-addresses">visit the documentation</a>.</span>)}>
          <span className="text-blue-400 cursor-pointer">Non-Bounceable</span>
        </AddressConverterHeaderColTooltip>
      </span>
    )
  },
  {
    key: "toRawString", label: <span>Raw Address String (
      <AddressConverterHeaderColTooltip content={(<span className="max-w-sm text-current">A non-bounceable address cannot receive messages that require a response, such as transactions. For more info, <a className="text-blue-400 underline" target="_blank" rel="noreferrer" href="https://docs.ton.org/v3/documentation/smart-contracts/addresses#raw-address">visit the documentation</a>.</span>)}>
        <span className="text-blue-400 cursor-pointer">info</span>
      </AddressConverterHeaderColTooltip>
      )</span>
  },
  {
    key: "normalized",
    label: (
      <span>
        Normalized Address
      </span>
    )
  },
]

export const AddressConverter = () => {
  const [raw, setRaw] = useState("");

  const parsed = parseAndResult(raw)
  const emptyCongent = !!raw && parsed.length === 0 ? INVAMID_CONTENT_PROVIDED : EMPTY_CONTENT;

  useBeforeUnload(raw);

  const handleRawChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setRaw(e.target.value);
  }, [])

  const renderCell = useCallback((data: AddressResultTableData, columnKey: AddressResultTableDataKey) => {
    const cellValue = data[columnKey];

    return <p className="text-bold text-sm capitalize text-default-500">{cellValue}</p>
  }, [])

  return (
    <div className="overflow-hidden w-full h-[calc(100dvh-57px-14px)] relative flex">
      <div className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
        <Table
          aria-label="Conversion Results"
          className="p-6 min-h-0 flex-grow drop-shadow-xl"
          classNames={{ tbody: "min-h-0" }}
          isHeaderSticky
        >
          <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          <TableBody<AddressResultTableData> items={addressResultsToTableData(parsed)} emptyContent={emptyCongent}>
            {(item) => (
              <TableRow key={item.key}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey as unknown as AddressResultTableDataKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="p-6 shadow-small ">
          <h1 className="text-2xl font-bold mb-2">Address Conversion Tool</h1>
          <p className="text-gray-600 mb-4">
            Quickly validate and convert TON blockchain addresses. Enter one or more addresses to check their validity and view normalized, raw, and formatted outputs.
          </p>

          <Textarea
            className="mb-6"
            label="TON Addresses"
            placeholder="Paste TON addresses here (separated by spaces or new lines)."
            onChange={handleRawChange}
          />
        </div>
      </div>
    </div>
  )
}