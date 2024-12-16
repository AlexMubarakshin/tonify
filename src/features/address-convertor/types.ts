import type { Address } from "ton-core";

export type AddressResult = {
  address: Address | undefined;
};

export type AddressResultTableData = {
  key: number;
  toStringBounceable: string | undefined;
  toStringNonBounceable: string | undefined;
  toRawString: string | undefined;
  normalized: string | undefined;
};

export type AddressResultTableDataKey = keyof AddressResultTableData;
