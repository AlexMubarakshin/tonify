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
  testnetBounceable: string | undefined;
  testnetNonBounceable: string | undefined;
};

export type AddressResultTableDataKey = keyof AddressResultTableData;

// Column keys that hold a copyable address value.
export type AddressColumnKey = Exclude<AddressResultTableDataKey, "key">;
